from django.utils import timezone
from rest_framework import serializers
from .models import Payment, ValidationRecord


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class ValidationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValidationRecord
        fields = '__all__'
        read_only_fields = ['result']

    def create(self, validated_data):
        subscription = validated_data['subscription']
        now = timezone.now()

        if subscription.start_date <= now <= subscription.expiry_date:
            plan = subscription.plan_type
            if plan and plan.plan_category == 'peak' and plan.peak_start_time and plan.peak_end_time:
                current_time = now.time()
                if plan.peak_start_time <= current_time <= plan.peak_end_time:
                    result = 'active'
                else:
                    result = 'expired'
            else:
                result = 'active'
        else:
            result = 'expired'

        validation = ValidationRecord.objects.create(
            subscription=subscription,
            conductor=validated_data.get('conductor'),
            result=result,
        )
        return validation