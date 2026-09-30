from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.core.mail import send_mail
from .models import Payment, ValidationRecord
from .serializers import PaymentSerializer, ValidationRecordSerializer
from .mpesa import initiate_stk_push
from accounts.permissions import IsConductor
from subscriptions.models import Subscription


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'passenger':
            return Payment.objects.filter(subscription__passenger=user).order_by('-id')
        if user.role == 'company_admin':
            return Payment.objects.filter(subscription__route__company=user.company).order_by('-id')
        return Payment.objects.all().order_by('-id')


class ValidationRecordListCreateView(generics.ListCreateAPIView):
    queryset = ValidationRecord.objects.all()
    serializer_class = ValidationRecordSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsConductor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'conductor':
            return ValidationRecord.objects.filter(conductor=user).order_by('-scanned_at')
        return ValidationRecord.objects.all().order_by('-scanned_at')


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
            payment.save()

            subscription = payment.subscription
            passenger = subscription.passenger
            if passenger.email:
                send_mail(
                    subject="Payment Successful — SafariPass",
                    message=(
                        f"Hi {passenger.username},\n\n"
                        f"Your payment of KES {payment.amount} was successful.\n\n"
                        f"Your subscription is now active on {subscription.route.origin} → {subscription.route.destination}, "
                        f"valid from {subscription.start_date.strftime('%d %b %Y')} to {subscription.expiry_date.strftime('%d %b %Y')}.\n\n"
                        f"Track your journey live: {settings.FRONTEND_URL}/passenger/map\n\n"
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

            subscription = payment.subscription
            passenger = subscription.passenger
            if passenger.email:
                send_mail(
                    subject="Payment Not Completed — SafariPass",
                    message=(
                        f"Hi {passenger.username},\n\n"
                        f"Your payment of KES {payment.amount} was not completed.\n\n"
                        f"You can try subscribing again from Browse Routes.\n\n"
                        f"— SafariPass"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[passenger.email],
                )

        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})