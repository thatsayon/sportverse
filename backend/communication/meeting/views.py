# views.py
import time
import json
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from agora_token_builder import RtcTokenBuilder
from django.conf import settings

class GenerateAgoraTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.body:
            return Response({"error": "Empty request body"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            body = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST)

        channel_name = body.get("channelName")
        uid = body.get("uid", 0)

        if not channel_name:
            return Response({"error": "channelName is required"}, status=status.HTTP_400_BAD_REQUEST)


        print("hi")
        # Agora credentials (store in settings.py or env variables)
        app_id = settings.AGORA_APP_ID
        app_certificate = settings.AGORA_APP_CERTIFICATE
        role = 1  # 1 = publisher, 2 = subscriber
        expiration_time_in_seconds = 3600
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expiration_time_in_seconds

        token = RtcTokenBuilder.buildTokenWithUid(
            app_id, app_certificate, channel_name, uid, role, privilege_expired_ts
        )

        return JsonResponse({
            "token": token,
            "appId": app_id,
            "channelName": channel_name,
            "uid": uid,
            "expireAt": privilege_expired_ts
        })

