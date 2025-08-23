from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    VerifyToken,
    VerifyOTP,
    GoogleLoginView,
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name='Register'),
    path("login/", UserLoginView.as_view(), name='Login'),
    path("verify-otp-token/", VerifyToken.as_view(), name='Verify OTP Token'),
    path("verify-otp/", VerifyOTP.as_view(), name='Verify OTP'),
    path("google/", GoogleLoginView.as_view(), name='Google')
]
