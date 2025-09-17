from django.urls import path
from .views import (
    TeacherDashboard,
    RevenueReportAPIView,
    BankView,
    PayPalView,
    WithdrawView,
    BookedSessionListView,
    TeacherGenerateVideoToken,
    PasswordUpdateView,
    DocumentView,
    AccountUploadView,
    AccountUploadWebhookView,
    AccountDetailView,
)

urlpatterns = [
    path('dashboard/', TeacherDashboard.as_view(), name='Dashboard'),
    path('booked-session/', BookedSessionListView.as_view(), name='Booked Session'),
    path('generate-token/<uuid:id>/', TeacherGenerateVideoToken.as_view(), name='Generate Token'),
    path('revenue-report/', RevenueReportAPIView.as_view(), name='Dashboard'),
    path('bank/', BankView.as_view(), name='Bank'),
    path('paypal/', PayPalView.as_view(), name='PayPal'),
    path('withdraw/', WithdrawView.as_view(), name='Withdraw'),
    path('update-password/', PasswordUpdateView.as_view(), name='Update Password'),
    path('document/', DocumentView.as_view(), name='Document'),
    path('upload-video/', AccountUploadView.as_view(), name='Account Video'),
    path('webhook/account-upload/', AccountUploadWebhookView.as_view(), name='Upload Webhook'),
    path('account/', AccountDetailView.as_view(), name='Account Detail')
]
