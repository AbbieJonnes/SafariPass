import uuid
from datetime import timedelta
from django.utils import timezone
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
        base_price = current_fare.price if current_fare else 0
        price_paid = base_price * plan_type.price_multiplier

        duration_days = 7 if plan_type.duration == 'weekly' else 30
        expiry_date = timezone.now() + timedelta(days=duration_days)

        subscription = Subscription.objects.create(
            passenger=validated_data['passenger'],
            route=route,
            plan_type=plan_type,
            price_paid=price_paid,
            expiry_date=expiry_date,
            qr_token=str(uuid.uuid4()),
        )
        return subscription

class RouteShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteShift
        fields = '__all__'