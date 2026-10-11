from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from .models import Payment, ValidationRecord
from .serializers import PaymentSerializer, ValidationRecordSerializer
from .mpesa import initiate_stk_push
from accounts.permissions import IsConductor
from subscriptions.models import Subscription, RouteShift
from subscriptions.services import activate_route_shift


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
        phone_number = request.data.get('phone_number')
        shift_id = request.data.get('route_shift')
        subscription_id = request.data.get('subscription')

        route_shift = None

        if shift_id:
            try:
                route_shift = RouteShift.objects.get(
                    id=shift_id,
                    subscription__passenger=request.user,
                    status='pending_payment',
                )
            except RouteShift.DoesNotExist:
                return Response({'error': 'Route shift not found or already handled.'}, status=status.HTTP_404_NOT_FOUND)
            subscription = route_shift.subscription
            amount = route_shift.extra_amount_paid
        else:
            try:
                subscription = Subscription.objects.get(id=subscription_id, passenger=request.user)
            except Subscription.DoesNotExist:
                return Response({'error': 'Subscription not found.'}, status=status.HTTP_404_NOT_FOUND)
            amount = subscription.price_paid

        result = initiate_stk_push(
            phone_number=phone_number,
            amount=amount,
            subscription_id=subscription.id,
        )

        Payment.objects.create(
            subscription=subscription,
            route_shift=route_shift,
            mpesa_transaction_id=result.get('CheckoutRequestID', 'PENDING'),
            amount=amount,
            status='pending',
        )

        return Response(result, status=status.HTTP_200_OK)


class PaymentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription_id = request.query_params.get('subscription')

        payment = Payment.objects.filter(
            subscription_id=subscription_id,
            subscription__passenger=request.user,
        ).order_by('-id').first()

        if not payment:
            return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'status': payment.status})


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

        subscription = payment.subscription
        passenger = subscription.passenger
        shift = payment.route_shift

        if result_code == 0:
            payment.status = 'success'
            payment.save()

            if shift:
                if shift.status == 'pending_payment':
                    activate_route_shift(shift)
            else:
                subscription.status = 'active'
                subscription.save()

                if passenger.email:
                    start = timezone.localtime(subscription.start_date).strftime('%d %b %Y')
                    end = timezone.localtime(subscription.expiry_date).strftime('%d %b %Y')
                    try:
                        send_mail(
                            subject="Payment Successful — SafariPass",
                            message=(
                                f"Hi {passenger.username},\n\n"
                                f"Your payment of KES {payment.amount} was successful.\n\n"
                                f"Your subscription is now active on {subscription.route.origin} → {subscription.route.destination}, "
                                f"valid from {start} to {end}.\n\n"
                                f"Track your journey live: {settings.FRONTEND_URL}/passenger/map\n\n"
                                f"If you ever need to temporarily switch routes, you can request a Route Shift from your account — "
                                f"it's free if the new route is the same price or cheaper, or you'll just pay the small difference if it's more expensive. "
                                f"Your pass automatically switches back to your original route once the shift period ends.\n\n"
                                f"Ride safe!\n— SafariPass"
                            ),
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[passenger.email],
                        )
                    except Exception as e:
                        print(f"Failed to send payment success email to {passenger.email}: {e}")
        else:
            payment.status = 'failed'
            payment.save()

            if shift:
                if shift.status == 'pending_payment':
                    shift.status = 'payment_failed'
                    shift.save()

                if passenger.email:
                    try:
                        send_mail(
                            subject="Route Shift Not Completed — SafariPass",
                            message=(
                                f"Hi {passenger.username},\n\n"
                                f"Your payment of KES {payment.amount} for the route shift was not completed, "
                                f"so your pass stays on its original route.\n\n"
                                f"You can try the shift again from Route Shift:\n"
                                f"{settings.FRONTEND_URL}/passenger/shift\n\n"
                                f"— SafariPass"
                            ),
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[passenger.email],
                        )
                    except Exception as e:
                        print(f"Failed to send route shift failure email to {passenger.email}: {e}")
            else:
                subscription.status = 'payment_failed'
                subscription.save()

                if passenger.email:
                    try:
                        send_mail(
                            subject="Payment Not Completed — SafariPass",
                            message=(
                                f"Hi {passenger.username},\n\n"
                                f"Your payment of KES {payment.amount} was not completed.\n\n"
                                f"You can try subscribing again from Browse Routes:\n"
                                f"{settings.FRONTEND_URL}/passenger/browse\n\n"
                                f"— SafariPass"
                            ),
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[passenger.email],
                        )
                    except Exception as e:
                        print(f"Failed to send payment failure email to {passenger.email}: {e}")

        return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'})