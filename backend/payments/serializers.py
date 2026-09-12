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