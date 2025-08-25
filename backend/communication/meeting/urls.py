from django.urls import path
from .views import (
    GenerateAgoraTokenView
)

urlpatterns = [
    path("agora/token/", GenerateAgoraTokenView.as_view(), name="agora-token"),
]
