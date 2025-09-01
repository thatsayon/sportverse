from django.urls import path

from .views import (
    GetorAddSportView,
    EditSportView,
)

urlpatterns = [
    path('get-or-create-sport/', GetorAddSportView.as_view()),
    path('update-sport/<uuid:id>/', EditSportView.as_view())
]
