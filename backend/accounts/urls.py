from django.urls import path
from .views import UserListCreateView, NotificationLogListCreateView

urlpatterns = [
    path('', UserListCreateView.as_view(), name='user-list-create'),
    path('notifications/', NotificationLogListCreateView.as_view(), name='notification-list-create'),
]