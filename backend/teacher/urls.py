from django.urls import path, include

urlpatterns = [
    path('session/', include('teacher.session.urls'))
]
