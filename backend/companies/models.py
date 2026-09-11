from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20, blank=True)
    commission_rate = models.DecimalField(max_digits=6, decimal_places=2, default=20.00)

    def __str__(self):
        return self.name


class Route(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='routes')
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.origin} → {self.destination} ({self.company.name})"


class Fare(models.Model):
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='fares')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    effective_from = models.DateTimeField(auto_now_add=True)
    effective_to = models.DateTimeField(null=True, blank=True)
    set_by = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        status = "current" if self.effective_to is None else "past"
        return f"{self.route} - KES {self.price} ({status})"


class PlanType(models.Model):
    PLAN_CHOICES = [
        ('full_day', 'Full Day'),
        ('peak', 'Peak Hours'),
    ]
    DURATION_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    plan_category = models.CharField(max_length=20, choices=PLAN_CHOICES)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    price_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=1.00)
    peak_start_time = models.TimeField(null=True, blank=True)
    peak_end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.get_plan_category_display()} - {self.get_duration_display()}"