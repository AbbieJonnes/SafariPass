from django.urls import path
from .views import (
    PaymentListCreateView,
    ValidationRecordListCreateView,
    InitiateMpesaPaymentView,
    MpesaCallbackView,
)

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('validations/', ValidationRecordListCreateView.as_view(), name='validation-list-create'),
    path('mpesa/initiate/', InitiateMpesaPaymentView.as_view(), name='mpesa-initiate'),
    path('mpesa-callback/', MpesaCallbackView.as_view(), name='mpesa-callback'),
]