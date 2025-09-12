from django.urls import path
from .views import (
    TrainerListView,
    TrainerDetailView,
    SessionDetailView,
    BookedSessionView,
    BookedSessionList,
    GenerateVideoToken
)

urlpatterns = [
    path('virtual-list/', TrainerListView.as_view(), name='Trainer List'),
    path('trainer-detail/<uuid:id>/', TrainerDetailView.as_view(), name='Trainer Detail'),
    path('session-detail/<uuid:id>/', SessionDetailView.as_view(), name='Session Detail'),
    path('session-book/<uuid:id>/', BookedSessionView.as_view(), name='Session Book'),
    path('booked-sessions/', BookedSessionList.as_view(), name='Booked Sessions'),
    path('generate-video-token/<uuid:id>/', GenerateVideoToken.as_view(), name='Generate Video Token'),
]
