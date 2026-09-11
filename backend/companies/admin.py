from django.contrib import admin
from .models import Company, Route, Fare, PlanType

admin.site.register(Company)
admin.site.register(Route)
admin.site.register(Fare)
admin.site.register(PlanType)