from django.urls import path
from .views import (
    TrainerListView,
    TrainerDetailView,
)

urlpatterns = [
    path('virtual-list/', TrainerListView.as_view(), name='Trainer List'),
    path('trainer-detail/<uuid:id>/', TrainerDetailView.as_view(), name='Trainer Detail'),
]
