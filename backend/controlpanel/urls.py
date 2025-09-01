from django.urls import path

from .views import (
    GetorAddSportView,
)

urlpatterns = [
    path('get-or-create-sport/', GetorAddSportView.as_view())
]
