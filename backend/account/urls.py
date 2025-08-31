from django.urls import path
from .views import (
    TecherVerficationView,
    GetSportsView,
)

urlpatterns = [
    path('teacher-verification/', TecherVerficationView.as_view(), name='Teacher Verification'),
    path('sports/', GetSportsView.as_view(), name='Sports'),
]
