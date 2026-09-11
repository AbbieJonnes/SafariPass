from django.contrib import admin
from .models import Payment, ValidationRecord

admin.site.register(Payment)
admin.site.register(ValidationRecord)