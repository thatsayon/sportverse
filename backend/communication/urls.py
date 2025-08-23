from django.urls import path, include

urlpatterns = [
    path('meeting/', include('communication.meeting.urls'))
]
