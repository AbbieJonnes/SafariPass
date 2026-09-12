from django.urls import path
from .views import SubscriptionListCreateView, RouteShiftListCreateView

urlpatterns = [
    path('', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('shifts/', RouteShiftListCreateView.as_view(), name='route-shift-list-create'),
]