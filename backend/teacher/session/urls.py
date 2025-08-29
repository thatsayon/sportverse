from django.urls import path

from .views import (
    SessionListView,
    SessionOptionCreateView,
    SessionOptionUpdateView,
    DeleteTimeSlotView,
    IsTimeslotAvailable,
)

urlpatterns = [
    path('get-session/', SessionListView.as_view()),
    path('create-session/', SessionOptionCreateView.as_view()),
    path('<uuid:id>/update-session/', SessionOptionUpdateView.as_view()),
    path('<uuid:id>/delete-timeslot/', DeleteTimeSlotView.as_view()),
    path('timeslot-availability/', IsTimeslotAvailable.as_view())
]
