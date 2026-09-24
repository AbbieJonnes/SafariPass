from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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
            payment.save()

            subscription = payment.subscription
            passenger = subscription.passenger
            if passenger.email:
                from django.core.mail import send_mail
                from django.conf import settings
                send_mail(
                    subject="Payment Successful — SafariPass",
                    message=(
                        f"Hi {passenger.username},\n\n"
                        f"Your payment of KES {payment.amount} was successful.\n\n"
                        f"Your subscription is now active on {subscription.route.origin} → {subscription.route.destination}, "
                        f"valid from {subscription.start_date.strftime('%d %b %Y')} to {subscription.expiry_date.strftime('%d %b %Y')}.\n\n"
                        f"If you ever need to temporarily switch routes, you can request a Route Shift from your account — "
                        f"it's free if the new route is the same price or cheaper, or you'll just pay the small difference if it's more expensive. "
                        f"Your pass automatically switches back to your original route once the shift period ends.\n\n"
                        f"Ride safe!\n— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[passenger.email],
                )
        else:
            payment.status = 'failed'
            payment.save()

        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})