from django.db import models
from accounts.models import User
from subscriptions.models import Subscription


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    ]

    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments')
    mpesa_transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subscription} - KES {self.amount} ({self.status})"


class ValidationRecord(models.Model):
    RESULT_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('invalid', 'Invalid'),
    ]

    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='validations')
    conductor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='validations_done')
    scanned_at = models.DateTimeField(auto_now_add=True)
    result = models.CharField(max_length=20, choices=RESULT_CHOICES)

    def __str__(self):
        return f"{self.subscription} - {self.result} at {self.scanned_at}"