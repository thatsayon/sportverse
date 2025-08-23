from django.urls import path
from .views import (
    CreateConsultationView,
    GenerateSignatureView
)

urlpatterns = [
    path('create/', CreateConsultationView.as_view()),
    path('signature/', GenerateSignatureView.as_view())
]
