from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, NotificationLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'company', 'profile_picture']


class NotificationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationLog
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'company']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'passenger'),
            company=validated_data.get('company', None),
        )

        if user.email:
            from django.core.mail import send_mail
            from django.conf import settings
            send_mail(
                subject="Welcome to SafariPass — Your Account is Active",
                message=(
                    f"Hi {user.username},\n\n"
                    f"Your SafariPass account has been created and is now active. "
                    f"You can log in right away and start browsing companies and routes.\n\n"
                    f"Once you subscribe to a plan, you'll receive your QR pass automatically — "
                    f"no downloads needed, it lives right in your account.\n\n"
                    f"Welcome aboard!\n— SafariPass"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])