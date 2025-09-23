from django.urls import path

from .views import (
    GetorAddSportView,
    EditSportView,
    TrinersListView,
    StudentListView,
    BookingView,
    WithdrawRequest,
    ProfileSettingView,
    PasswordUpdateView,
    AdminDashboard,
    AnalyticsView,
    ChatLogView,
    ChatLogDetailView,
    WithdrawPaymentDetailView
)

urlpatterns = [
    path('dashboard/', AdminDashboard.as_view()),
    path('get-or-create-sport/', GetorAddSportView.as_view()),
    path('update-sport/<uuid:id>/', EditSportView.as_view()),
    path('trainer-list/', TrinersListView.as_view()),
    path('trainee-list/', StudentListView.as_view()),
    path('booking/', BookingView.as_view()),
    path('withdraw/', WithdrawRequest.as_view()),
    path('withdraw/<uuid:id>/', WithdrawRequest.as_view()),
    path('profile/', ProfileSettingView.as_view()),
    path('password-update/', PasswordUpdateView.as_view()),
    path('analytics/', AnalyticsView.as_view()),
    path('chatlog/', ChatLogView.as_view()),
    path('chatlog/<uuid:id>/', ChatLogDetailView.as_view()),
    path('withdraw-detail/<uuid:id>/', WithdrawPaymentDetailView.as_view())
]
