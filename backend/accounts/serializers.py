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
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'company']

    def validate(self, data):
        role = data.get('role', 'passenger')
        password = data.get('password')
        if role == 'passenger' and not password:
            raise serializers.ValidationError({'password': 'This field is required.'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        role = validated_data.get('role', 'passenger')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=password if password else None,
            role=role,
            company=validated_data.get('company', None),
        )

        if not password:
            user.set_unusable_password()
            user.save()
            self.send_set_password_email(user)
        elif user.email:
            self.send_welcome_email(user)

        return user

    def send_welcome_email(self, user):
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

    def send_set_password_email(self, user):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        from django.core.mail import send_mail
        from django.conf import settings

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        set_password_url = f"{settings.FRONTEND_URL}/set-password/{uid}/{token}"

        send_mail(
            subject="Welcome to SafariPass — Set Your Password",
            message=(
                f"Hi {user.username},\n\n"
                f"An account has been created for you on SafariPass as a {user.get_role_display()}.\n\n"
                f"Please set your password using the link below to activate your account:\n"
                f"{set_password_url}\n\n"
                f"— SafariPass"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'profile_picture', 'company']
        read_only_fields = ['id', 'role', 'company']

class UserListSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'company', 'company_name', 'is_active']

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None