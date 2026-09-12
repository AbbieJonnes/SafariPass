from rest_framework import generics
from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionListCreateView(generics.ListCreateAPIView):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer