from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('account/', include('account.urls')),
    path('communication/', include('communication.urls')),
    path('teacher/', include('teacher.urls')),
    path('student/', include('student.urls')),
    path('map/', include('map.urls')),
    path('control/', include('controlpanel.urls')),
    path('video/', include('video.urls')),
]
