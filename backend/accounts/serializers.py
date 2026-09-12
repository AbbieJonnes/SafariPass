from rest_framework import serializers
from .models import User, NotificationLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'company', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}


class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = '__all__'