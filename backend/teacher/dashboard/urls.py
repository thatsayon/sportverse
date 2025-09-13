from django.urls import path
from .views import (
    TeacherDashboard
)

urlpatterns = [
    path('dashboard/', TeacherDashboard.as_view(), name='Dashboard'),
]
