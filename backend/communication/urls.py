from django.urls import path, include

urlpatterns = [
    path('meeting/', include('communication.meeting.urls')),
    path('msg/', include('communication.messaging.urls'))
]
