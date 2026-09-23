from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .tasks import check_unused_days_rollover, revert_expired_route_shifts
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

        check_unused_days_rollover()
        revert_expired_route_shifts()
        return Response({'status': 'Daily checks completed successfully.'})

class SubscriptionListCreateView(generics.ListCreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPassenger()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(passenger=self.request.user)


class RouteShiftListCreateView(generics.ListCreateAPIView):
    queryset = RouteShift.objects.all()
    serializer_class = RouteShiftSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsPassenger()]
        return super().get_permissions()