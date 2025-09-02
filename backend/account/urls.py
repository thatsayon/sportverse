from django.urls import path
from .views import (
    TecherVerficationView,
    GetSportsView,
    AddFavoriteSportView,
)

urlpatterns = [
    path('teacher-verification/', TecherVerficationView.as_view(), name='Teacher Verification'),
    path('sports/', GetSportsView.as_view(), name='Sports'),
    path('add-fav-sports/', AddFavoriteSportView.as_view(), name='Add Fav Sports'),
]
