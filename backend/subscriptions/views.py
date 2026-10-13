from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics
from .tasks import (
    check_unused_days_rollover,
    revert_expired_route_shifts,
    send_expiry_warnings,
    send_expired_notices,
)
from .models import Subscription, RouteShift
from .serializers import SubscriptionSerializer, RouteShiftSerializer
from accounts.permissions import IsPassenger


def _run_step(name, fn):
    try:
        return fn()
    except Exception as e:
        print(f"Daily check '{name}' failed: {e}")
        return f"error: {e}"


class RunDailyChecksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        secret = request.query_params.get('secret')
        if secret != settings.CRON_SECRET:
            return Response({'error': 'Unauthorized'}, status=403)

        results = {
            'expired_notices_sent': _run_step('expired', send_expired_notices),
            'rollover_extended': _run_step('rollover', check_unused_days_rollover),
            'route_shifts_reverted': _run_step('shifts', revert_expired_route_shifts),
            'expiry_warnings_sent': _run_step('warnings', send_expiry_warnings),
        }
        print(f"Daily checks finished: {results}")
        return Response({'status': 'Daily checks finished.', 'results': results})


class SubscriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPassenger()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        unpaid = ['pending', 'payment_failed']
        if user.role == 'passenger':
            return Subscription.objects.filter(passenger=user).exclude(status__in=unpaid).order_by('-start_date')
        if user.role == 'company_admin':
            return Subscription.objects.filter(route__company=user.company).exclude(status__in=unpaid).order_by('-start_date')
        return Subscription.objects.all().order_by('-start_date')

    def perform_create(self, serializer):
        serializer.save(passenger=self.request.user)


class RouteShiftListCreateView(generics.ListCreateAPIView):
    serializer_class = RouteShiftSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPassenger()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        base = RouteShift.objects.exclude(status='payment_failed')
        if user.role == 'passenger':
            return base.filter(subscription__passenger=user).order_by('-starts_at')
        if user.role == 'company_admin':
            return base.filter(subscription__route__company=user.company).order_by('-starts_at')
        return base.order_by('-starts_at')