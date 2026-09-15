from rest_framework import generics
from .models import Subscription, RouteShift
from .serializers import SubscriptionSerializer, RouteShiftSerializer
from accounts.permissions import IsPassenger


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