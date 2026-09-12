from rest_framework import generics
from .models import Subscription, RouteShift
from .serializers import SubscriptionSerializer, RouteShiftSerializer


class SubscriptionListCreateView(generics.ListCreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

class RouteShiftListCreateView(generics.ListCreateAPIView):
    queryset = RouteShift.objects.all()
    serializer_class = RouteShiftSerializer