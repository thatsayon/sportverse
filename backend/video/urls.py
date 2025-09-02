from django.urls import path
from .views import VideoUploadSignatureView

urlpatterns = [
    path("upload-signature/", VideoUploadSignatureView.as_view(), name='Upload Signature'),
]
