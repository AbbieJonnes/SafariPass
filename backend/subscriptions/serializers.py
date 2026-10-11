import math
import uuid
from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from rest_framework import serializers
from .models import Subscription, RouteShift
from .services import activate_route_shift
from companies.models import Fare


def daily_total(route):
    """Morning + evening fare for a route (evening defaults to morning)."""
    fare = Fare.objects.filter(route=route, effective_to__isnull=True).first()
    if not fare:
        return Decimal('0')
    morning = fare.price
    evening = fare.evening_price if fare.evening_price is not None else morning
    return morning + evening


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['passenger', 'price_paid', 'start_date', 'expiry_date', 'qr_token', 'status', 'shift_count']

    def create(self, validated_data):
        route = validated_data['route']
        plan_type = validated_data['plan_type']

        price_paid = daily_total(route) * plan_type.price_multiplier

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
        read_only_fields = ['original_route', 'starts_at', 'ends_at', 'reverted', 'extra_amount_paid', 'status']

    def create(self, validated_data):
        request = self.context.get('request')
        subscription = validated_data['subscription']

        if request and subscription.passenger != request.user:
            raise serializers.ValidationError({'detail': 'This is not your subscription.'})

        if subscription.status != 'active' or subscription.expiry_date < timezone.now():
            raise serializers.ValidationError({'detail': 'Route shifts are only available on an active, paid subscription.'})

        if subscription.shift_count >= 3:
            raise serializers.ValidationError({'detail': 'You have used all 3 route shifts for this subscription.'})

        temporary_route = validated_data['temporary_route']
        original_route = subscription.route

        if temporary_route == original_route:
            raise serializers.ValidationError({'detail': 'You are already on this route.'})

        remaining_seconds = (subscription.expiry_date - timezone.now()).total_seconds()
        remaining_days = max(1, math.ceil(remaining_seconds / 86400))

        daily_gap = daily_total(temporary_route) - daily_total(original_route)
        extra_amount = Decimal(math.ceil(daily_gap * remaining_days)) if daily_gap > 0 else Decimal('0')

        RouteShift.objects.filter(
            subscription=subscription, status='pending_payment'
        ).update(status='payment_failed')

        shift = RouteShift.objects.create(
            subscription=subscription,
            original_route=original_route,
            temporary_route=temporary_route,
            ends_at=subscription.expiry_date,
            extra_amount_paid=extra_amount,
            status='pending_payment' if extra_amount > 0 else 'active',
        )

        if extra_amount == 0:
            activate_route_shift(shift)

        return shift