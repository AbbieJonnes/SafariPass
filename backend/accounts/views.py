from rest_framework import generics
from .models import User, NotificationLog
from .serializers import UserSerializer, NotificationLogSerializer


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class NotificationLogListCreateView(generics.ListCreateAPIView):
    queryset = NotificationLog.objects.all()
    serializer_class = NotificationLogSerializer