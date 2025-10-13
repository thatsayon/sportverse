from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    VerifyToken,
    VerifyOTP,
    ForgetPassView,
    ForgetPassOTPVerifyView,
    ForgettedPasswordSetView,
    ResendRegistrationOTPView,
    ResendForgetPassOTPView,
    GoogleLoginView,
    AccessTokenValidation,
    GoogleLogin,
    GoogleSignup,
    GoogleExchangeView
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name='Register'),
    path("login/", UserLoginView.as_view(), name='Login'),
    path("verify-otp-token/", VerifyToken.as_view(), name='Verify OTP Token'),
    path("verify-otp/", VerifyOTP.as_view(), name='Verify OTP'),
    path("forget-password/", ForgetPassView.as_view(), name='Forget Password'),
    path("forget-password-otp-verify/", ForgetPassOTPVerifyView.as_view(), name='Forget Password OTP Verify'),
    path("forget-password-set/", ForgettedPasswordSetView.as_view(), name='Forget Password Set'),
    path("resend-registration-otp/", ResendRegistrationOTPView.as_view(), name='Resend Registration OTP'),
    path("resend-forget-password-otp/", ResendForgetPassOTPView.as_view(), name='Resend Forget Pass OTP'),
    path("google/", GoogleLoginView.as_view(), name='Google'),
    path("generate-access-token/", AccessTokenValidation.as_view(), name='Generate Access Token'),
    path("google-login/", GoogleLogin.as_view(), name='Google Login'),
    path("google-signup/", GoogleSignup.as_view(), name='Google Signup'),
    path("google-exchange/", GoogleExchangeView.as_view(), name='Google Exchange')
]
