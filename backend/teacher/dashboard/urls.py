from django.urls import path
from .views import (
    TeacherDashboard,
    RevenueReportAPIView,
    BankView,
    PayPalView,
    WithdrawView,
    BookedSessionListView,
    TeacherGenerateVideoToken,
)

urlpatterns = [
    path('dashboard/', TeacherDashboard.as_view(), name='Dashboard'),
    path('booked-session/', BookedSessionListView.as_view(), name='Booked Session'),
    path('generate-token/<uuid:id>/', TeacherGenerateVideoToken.as_view(), name='Generate Token'),
    path('revenue-report/', RevenueReportAPIView.as_view(), name='Dashboard'),
    path('bank/', BankView.as_view(), name='Bank'),
    path('paypal/', PayPalView.as_view(), name='PayPal'),
    path('withdraw/', WithdrawView.as_view(), name='Withdraw'),
]
