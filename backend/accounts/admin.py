from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, NotificationLog


class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('SafariPass Info', {'fields': ('role', 'company', 'profile_picture')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('SafariPass Info', {'fields': ('role', 'company', 'profile_picture')}),
    )
    list_display = ('username', 'email', 'role', 'company', 'is_staff')


admin.site.register(User, CustomUserAdmin)
admin.site.register(NotificationLog)