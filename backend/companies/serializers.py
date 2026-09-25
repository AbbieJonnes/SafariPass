from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import Company, Route, Fare, PlanType
import requests
from django.conf import settings

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'
        read_only_fields = ['origin_lat', 'origin_lng', 'destination_lat', 'destination_lng']

    def geocode(self, place_name):
        url = "https://api.geoapify.com/v1/geocode/search"
        params = {
            'text': f"{place_name}, Kenya",
            'apiKey': settings.GEOAPIFY_API_KEY,
            'limit': 1,
        }
        response = requests.get(url, params=params)
        data = response.json()

        features = data.get('features', [])
        if features:
            coords = features[0]['geometry']['coordinates']
            return coords[1], coords[0]
        return None, None

    def create(self, validated_data):
        route = Route.objects.create(**validated_data)

        origin_lat, origin_lng = self.geocode(validated_data['origin'])
        destination_lat, destination_lng = self.geocode(validated_data['destination'])

        route.origin_lat = origin_lat
        route.origin_lng = origin_lng
        route.destination_lat = destination_lat
        route.destination_lng = destination_lng
        route.save()

        return route

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