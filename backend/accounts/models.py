from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('company_admin', 'Company Admin'),
        ('conductor', 'Conductor'),
        ('passenger', 'Passenger'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='passenger')
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

class NotificationLog(models.Model):
    TYPE_CHOICES = [
        ('payment_success', 'Payment Success'),
        ('activation', 'Subscription Activation'),
        ('expiry_warning', 'Expiry Warning'),
        ('fare_change', 'Fare Change'),
        ('rollover_extension', 'Rollover Extension'),
        ('shift_started', 'Route Shift Started'),
        ('shift_reverted', 'Route Shift Reverted'),
        ('shift_payment_required', 'Shift Payment Required'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_type_display()} at {self.sent_at}"