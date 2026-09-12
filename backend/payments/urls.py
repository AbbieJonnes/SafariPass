from django.urls import path
from .views import PaymentListCreateView, ValidationRecordListCreateView

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('validations/', ValidationRecordListCreateView.as_view(), name='validation-list-create'),
]