from django.urls import path, include

urlpatterns = [
    path("notifications/", include("notifications.urls")),
]

