import uuid
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import serializers
from .models import Subscription, RouteShift
from companies.models import Fare


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['passenger', 'price_paid', 'start_date', 'expiry_date', 'qr_token', 'status', 'shift_count']

    def create(self, validated_data):
        route = validated_data['route']
        plan_type = validated_data['plan_type']

        current_fare = Fare.objects.filter(route=route, effective_to__isnull=True).first()
        morning_price = current_fare.price if current_fare else 0
        evening_price = current_fare.evening_price if current_fare and current_fare.evening_price else morning_price
        price_paid = (morning_price + evening_price) * plan_type.price_multiplier

        duration_days = 7 if plan_type.duration == 'weekly' else 30
        expiry_date = timezone.now() + timedelta(days=duration_days)

        subscription = Subscription.objects.create(
            passenger=validated_data['passenger'],
            route=route,
            plan_type=plan_type,
            price_paid=price_paid,
            expiry_date=expiry_date,
            qr_token=str(uuid.uuid4()),
            status='pending',
        )
        return subscription
    
    def to_representation(self, instance):
        from companies.serializers import RouteSerializer
        data = super().to_representation(instance)
        data['route'] = RouteSerializer(instance.route).data
        data['passenger_username'] = instance.passenger.username
        if instance.plan_type:
            data['plan_label'] = f"{instance.plan_type.get_plan_category_display()} — {instance.plan_type.get_duration_display()}"
        else:
            data['plan_label'] = ''
        return data

class RouteShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteShift
        fields = '__all__'
        read_only_fields = ['original_route', 'starts_at', 'ends_at', 'reverted', 'extra_amount_paid']

    def create(self, validated_data):
        subscription = validated_data['subscription']

        if subscription.status != 'active':
            raise serializers.ValidationError({'detail': 'Route shifts are only available on an active, paid subscription.'})

        if subscription.shift_count >= 3:
            raise serializers.ValidationError({'detail': 'You have used all 3 route shifts for this subscription.'})

        temporary_route = validated_data['temporary_route']
        original_route = subscription.route

        original_fare = Fare.objects.filter(route=original_route, effective_to__isnull=True).first()
        new_fare = Fare.objects.filter(route=temporary_route, effective_to__isnull=True).first()

        original_price = original_fare.price if original_fare else 0
        new_price = new_fare.price if new_fare else 0
        extra_amount = max(new_price - original_price, 0)

        starts_at = timezone.now()
        ends_at = subscription.expiry_date

        shift = RouteShift.objects.create(
            subscription=subscription,
            original_route=original_route,
            temporary_route=temporary_route,
            starts_at=starts_at,
            ends_at=ends_at,
            extra_amount_paid=extra_amount,
        )

        subscription.shift_count += 1
        subscription.save()

        passenger = shift.subscription.passenger
        if passenger.email:
            send_mail(
                subject="Route Shift Confirmed — SafariPass",
                message=(
                    f"Hi {passenger.username},\n\n"
                    f"Your subscription has been temporarily shifted from "
                    f"{shift.original_route.origin} → {shift.original_route.destination} "
                    f"to {shift.temporary_route.origin} → {shift.temporary_route.destination}.\n\n"
                    f"This shift is active from {shift.starts_at.strftime('%d %b %Y, %I:%M %p')} "
                    f"to {shift.ends_at.strftime('%d %b %Y, %I:%M %p')}.\n\n"
                    f"Track your journey live: {settings.FRONTEND_URL}/passenger/map\n\n"
                    f"After that time, your pass will automatically return to your original route.\n\n"
                    f"— SafariPass"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[passenger.email],
            )
        return shift