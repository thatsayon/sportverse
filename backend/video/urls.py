from django.urls import path
from .views import (
    VideoUploadSignatureView,
    VideoListView
)

urlpatterns = [
    path("upload-signature/", VideoUploadSignatureView.as_view(), name='Upload Signature'),
    path("video-list/", VideoListView.as_view(), name='Video List')
]
