from rest_framework import generics
from .models import Payment, ValidationRecord
from .serializers import PaymentSerializer, ValidationRecordSerializer
from accounts.permissions import IsConductor


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer


class ValidationRecordListCreateView(generics.ListCreateAPIView):
    queryset = ValidationRecord.objects.all()
    serializer_class = ValidationRecordSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsConductor()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(conductor=self.request.user)