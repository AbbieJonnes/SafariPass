from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Payment, ValidationRecord
from .serializers import PaymentSerializer, ValidationRecordSerializer
from .mpesa import initiate_stk_push
from accounts.permissions import IsConductor
from subscriptions.models import Subscription


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


class InitiateMpesaPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subscription_id = request.data.get('subscription')
        phone_number = request.data.get('phone_number')

        try:
            subscription = Subscription.objects.get(id=subscription_id)
        except Subscription.DoesNotExist:
            return Response({'error': 'Subscription not found.'}, status=status.HTTP_404_NOT_FOUND)

        result = initiate_stk_push(
            phone_number=phone_number,
            amount=subscription.price_paid,
            subscription_id=subscription.id,
        )

        Payment.objects.create(
            subscription=subscription,
            mpesa_transaction_id=result.get('CheckoutRequestID', 'PENDING'),
            amount=subscription.price_paid,
            status='pending',
        )

        return Response(result, status=status.HTTP_200_OK)


class MpesaCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        callback_data = request.data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = callback_data.get('CheckoutRequestID')
        result_code = callback_data.get('ResultCode')

        try:
            payment = Payment.objects.get(mpesa_transaction_id=checkout_request_id)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if result_code == 0:
            payment.status = 'success'
        else:
            payment.status = 'failed'
        payment.save()

        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})