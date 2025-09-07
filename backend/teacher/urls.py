from django.urls import path, include
from .views import (
    RatingReviewView
)
urlpatterns = [
    path('session/', include('teacher.session.urls')),
    path('rate-review/', RatingReviewView.as_view())
]
