from django.urls import path
from .views import (
    TeacherDashboard,
    RevenueReportAPIView,
    BankView,
    PayPalView,
    WithdrawView
)

urlpatterns = [
    path('dashboard/', TeacherDashboard.as_view(), name='Dashboard'),
    path('revenue-report/', RevenueReportAPIView.as_view(), name='Dashboard'),
    path('bank/', BankView.as_view(), name='Bank'),
    path('paypal/', PayPalView.as_view(), name='PayPal'),
    path('withdraw/', WithdrawView.as_view(), name='Withdraw'),
]
