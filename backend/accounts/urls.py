from django.urls import path
from .views import (
    UserListCreateView,
    NotificationLogListCreateView,
    RegisterView,
    LoginView,
    LogoutView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('notifications/', NotificationLogListCreateView.as_view(), name='notification-list-create'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]