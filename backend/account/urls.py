from django.urls import path
from .views import (
    TecherVerficationView
)

urlpatterns = [
    path('teacher-verification/', TecherVerficationView.as_view(), name='Teacher Verification'),
]
