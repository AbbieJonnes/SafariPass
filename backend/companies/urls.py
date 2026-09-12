from django.urls import path
from .views import (
    CompanyListCreateView, 
    RouteListCreateView, 
    FareListCreateView, 
    PlanTypeListCreateView)

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company-list-create'),
    path('routes/', RouteListCreateView.as_view(), name='route-list-create'),
    path('fares/', FareListCreateView.as_view(), name='fare-list-create'),
    path('plan-types/', PlanTypeListCreateView.as_view(), name='plan-type-list-create'),
]