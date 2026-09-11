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