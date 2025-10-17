from django.urls import path, include
from .views import (
    RatingReviewView,
    VideoLibraryView,
    ProTeacher
)

urlpatterns = [
    path('session/', include('teacher.session.urls')),
    path('d/', include('teacher.dashboard.urls')),
    path('rate-review/', RatingReviewView.as_view()),
    path('video-library/', VideoLibraryView.as_view()),
    path('pro/', ProTeacher.as_view())
]
