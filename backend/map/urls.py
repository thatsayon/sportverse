from django.urls import path
from .views import (
    FindNearestTeacherView,
)

urlpatterns = [
    path('nearest-teacher/', FindNearestTeacherView.as_view())
]
