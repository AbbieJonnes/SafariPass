from django.urls import path
from .views import CompanyListCreateView, RouteListCreateView

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company-list-create'),
    path('routes/', RouteListCreateView.as_view(), name='route-list-create'),
]