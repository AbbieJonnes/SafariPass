from django.urls import path
from .views import SubscriptionListCreateView, RouteShiftListCreateView, RunDailyChecksView

urlpatterns = [
    path('', SubscriptionListCreateView.as_view(), name='subscription-list-create'),
    path('shifts/', RouteShiftListCreateView.as_view(), name='route-shift-list-create'),
    path('run-daily-checks/', RunDailyChecksView.as_view(), name='run-daily-checks'),
]