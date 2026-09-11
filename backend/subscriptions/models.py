from django.db import models
from accounts.models import User
from companies.models import Route, PlanType


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('switched', 'Switched'),
    ]

    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='subscriptions')
    plan_type = models.ForeignKey(PlanType, on_delete=models.SET_NULL, null=True)
    price_paid = models.DecimalField(max_digits=8, decimal_places=2)
    start_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateTimeField()
    qr_token = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    shift_count = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        return f"{self.passenger.username} - {self.route} ({self.status})"


class RouteShift(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='shifts')
    original_route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='shift_originals')
    temporary_route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='shift_temporaries')
    starts_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField()
    reverted = models.BooleanField(default=False)
    extra_amount_paid = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    def __str__(self):
        return f"Shift: {self.subscription} → {self.temporary_route}"