from django.urls import path

from .views import (
    GetorAddSportView,
    EditSportView,
    TrinersListView,
    StudentListView,
    BookingView,
    WithdrawRequest
)

urlpatterns = [
    path('get-or-create-sport/', GetorAddSportView.as_view()),
    path('update-sport/<uuid:id>/', EditSportView.as_view()),
    path('trainer-list/', TrinersListView.as_view()),
    path('trainee-list/', StudentListView.as_view()),
    path('booking/', BookingView.as_view()),
    path('withdraw/', WithdrawRequest.as_view()),
    path('withdraw/<uuid:id>/', WithdrawRequest.as_view())
]
