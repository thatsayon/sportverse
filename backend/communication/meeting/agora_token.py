import time
import os
from django.conf import settings
from django.http import JsonResponse
from agora_token_builder import RtcTokenBuilder

# Load from environment
APP_ID = os.getenv("AGORA_APP_ID")
APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE")

def generate_agora_token(request):
    channel_name = request.GET.get("channelName")
    uid = request.GET.get("uid", "0")  # Can be user ID or "0" for auto
    role = 1  # 1 = host, 2 = audience
    expire_time_in_seconds = 3600

    current_timestamp = int(time.time())
    privilege_expired_ts = current_timestamp + expire_time_in_seconds

    token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID, APP_CERTIFICATE, channel_name, int(uid), role, privilege_expired_ts
    )
    return JsonResponse({"token": token, "appId": APP_ID})

