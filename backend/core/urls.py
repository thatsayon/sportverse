from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
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
    path('payment/', include('payment.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
