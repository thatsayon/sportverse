from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('authentication.urls')),
    path('account/', include('account.urls')),
    path('communication/', include('communication.urls')),
    path('teacher/', include('teacher.urls')),
    path('map/', include('map.urls')),
]
