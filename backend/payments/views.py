from rest_framework import generics
from .models import Payment, ValidationRecord
from .serializers import PaymentSerializer, ValidationRecordSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class ValidationRecordListCreateView(generics.ListCreateAPIView):
    queryset = ValidationRecord.objects.all()
    serializer_class = ValidationRecordSerializer