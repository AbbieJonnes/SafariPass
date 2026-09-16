from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import Company, Route, Fare, PlanType


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


class FareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fare
        fields = '__all__'
        read_only_fields = ['effective_from', 'effective_to', 'set_by']

    def create(self, validated_data):
        route = validated_data['route']
        request = self.context.get('request')

        old_fare = Fare.objects.filter(route=route, effective_to__isnull=True).first()
        if old_fare:
            old_fare.effective_to = timezone.now()
            old_fare.save()

        new_fare = Fare.objects.create(
            route=route,
            price=validated_data['price'],
            set_by=request.user if request else None,
        )

        self._notify_affected_users(route, new_fare)
        return new_fare

    def _notify_affected_users(self, route, fare):
        from accounts.models import User, NotificationLog
        company = route.company

        passenger_ids = User.objects.filter(
            subscriptions__route__company=company
        ).values_list('id', flat=True).distinct()

        conductor_ids = User.objects.filter(
            role='conductor', company=company
        ).values_list('id', flat=True)

        affected_ids = set(passenger_ids) | set(conductor_ids)
        affected_users = User.objects.filter(id__in=affected_ids)

        for user in affected_users:
            if not user.email:
                continue
            send_mail(
                subject=f"Fare update for {company.name}",
                message=(
                    f"Hi {user.username},\n\n"
                    f"The fare for {route.origin} → {route.destination} "
                    f"with {company.name} has changed to KES {fare.price}.\n\n"
                    f"— SafariPass"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )
            NotificationLog.objects.create(user=user, type='fare_change')


class PlanTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanType
        fields = '__all__'