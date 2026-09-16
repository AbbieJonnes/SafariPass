from django.urls import path
from .views import (
    RevenueAnalyticsView,
    ActiveSubscriptionsAnalyticsView,
    RoutePopularityAnalyticsView,
    BoardingValidationAnalyticsView,
)

urlpatterns = [
    path('revenue/', RevenueAnalyticsView.as_view(), name='analytics-revenue'),
    path('active-subscriptions/', ActiveSubscriptionsAnalyticsView.as_view(), name='analytics-active-subscriptions'),
    path('route-popularity/', RoutePopularityAnalyticsView.as_view(), name='analytics-route-popularity'),
    path('boarding-validations/', BoardingValidationAnalyticsView.as_view(), name='analytics-boarding-validations'),
]