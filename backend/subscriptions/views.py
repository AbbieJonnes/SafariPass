from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .tasks import check_unused_days_rollover, revert_expired_route_shifts, send_expiry_warnings, send_expired_notices
from rest_framework import generics
from .models import Subscription, RouteShift
from .serializers import SubscriptionSerializer, RouteShiftSerializer
from accounts.permissions import IsPassenger

class RunDailyChecksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        secret = request.query_params.get('secret')
        if secret != settings.CRON_SECRET:
            return Response({'error': 'Unauthorized'}, status=403)

        send_expired_notices()
        check_unused_days_rollover()
        revert_expired_route_shifts()
        send_expiry_warnings()
        return Response({'status': 'Daily checks completed successfully.'})

class SubscriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPassenger()]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'passenger':
            return Subscription.objects.filter(passenger=user).order_by('-start_date')
        if user.role == 'company_admin':
            return Subscription.objects.filter(route__company=user.company).order_by('-start_date')
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
        if user.role == 'passenger':
            return RouteShift.objects.filter(subscription__passenger=user).order_by('-starts_at')
        if user.role == 'company_admin':
            return RouteShift.objects.filter(subscription__route__company=user.company).order_by('-starts_at')
        return RouteShift.objects.all().order_by('-starts_at')