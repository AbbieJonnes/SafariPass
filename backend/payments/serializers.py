from django.utils import timezone
from rest_framework import serializers
from .models import Payment, ValidationRecord
from subscriptions.models import Subscription


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class ValidationRecordSerializer(serializers.ModelSerializer):
    qr_token = serializers.UUIDField(write_only=True)
    route = serializers.SerializerMethodField()
    plan_type = serializers.SerializerMethodField()
    passenger_username = serializers.SerializerMethodField()

    class Meta:
        model = ValidationRecord
        fields = ['id', 'qr_token', 'conductor', 'scanned_at', 'result', 'route', 'plan_type', 'passenger_username']
        read_only_fields = ['id', 'conductor', 'scanned_at', 'result']

    def get_route(self, obj):
        return f"{obj.subscription.route.origin} to {obj.subscription.route.destination}"

    def get_plan_type(self, obj):
        return f"{obj.subscription.plan_type.plan_category} ({obj.subscription.plan_type.duration})"

    def get_passenger_username(self, obj):
        return obj.subscription.passenger.username

    def create(self, validated_data):
        qr_token = validated_data.pop('qr_token')
        try:
            subscription = Subscription.objects.get(qr_token=str(qr_token))
        except Subscription.DoesNotExist:
            raise serializers.ValidationError({'qr_token': 'No subscription found for this QR code.'})

        now = timezone.now()

        if subscription.expiry_date < now:
            result = 'expired'
        elif subscription.status != 'active':
            result = 'invalid'
        else:
            plan = subscription.plan_type
            if plan and plan.plan_category == 'peak' and plan.peak_start_time and plan.peak_end_time:
                current = timezone.localtime(now).time()
                start, end = plan.peak_start_time, plan.peak_end_time
                if start <= end:
                    in_window = start <= current <= end
                else:
                    in_window = current >= start or current <= end
                result = 'active' if in_window else 'invalid'
            else:
                result = 'active'

        return ValidationRecord.objects.create(
            subscription=subscription,
            conductor=self.context['request'].user,
            result=result,
        )