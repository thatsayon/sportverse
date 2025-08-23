import requests, base64
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import ConsultationMeeting

class CreateConsultationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        teacher = request.user
        student_id = request.data.get("student_id")

        # Get Zoom OAuth Access Token
        token = self._get_access_token()  # now works
        if not token:
            return Response({"error": "Unable to fetch Zoom token"}, status=500)

        url = "https://api.zoom.us/v2/users/me/meetings"
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        payload = {"topic": "Consultation", "type": 1}

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 201:
            return Response(response.json(), status=response.status_code)

        data = response.json()

        # meeting = ConsultationMeeting.objects.create(
        #     teacher=teacher,
        #     student_id=student_id,
        #     meeting_number=data["id"],
        #     start_url=data["start_url"],
        #     join_url=data["join_url"],
        # )
        #
        print(data)
        # return Response({
        #     "meeting_number": meeting.meeting_number,
        #     "start_url": meeting.start_url,
        #     "join_url": meeting.join_url
        # })
        return Response(data)

    def _get_access_token(self):
        """Add self as first argument!"""
        client_id = settings.ZOOM_CLIENT_ID
        client_secret = settings.ZOOM_CLIENT_SECRET
        account_id = settings.ZOOM_ACCOUNT_ID

        # Basic Auth
        auth_str = f"{client_id}:{client_secret}"
        b64_auth = base64.b64encode(auth_str.encode()).decode()

        url = "https://zoom.us/oauth/token"
        headers = {
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        data = {
            "grant_type": "account_credentials",
            "account_id": account_id
        }

        r = requests.post(url, headers=headers, data=data)

        if r.status_code != 200:
            print("Error fetching token:", r.status_code, r.text)
            return None

        return r.json().get("access_token")

class GenerateSignatureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        import jwt, time
        meeting_number = request.data.get("meetingNumber")
        role = request.data.get("role", 0)  # 0=student, 1=teacher

        iat = int(time.time())
        exp = iat + 60 * 5

        payload = {
            "sdkKey": settings.ZOOM_SDK_KEY,
            "mn": meeting_number,
            "role": role,
            "iat": iat,
            "exp": exp,
            "appKey": settings.ZOOM_SDK_KEY,
            "tokenExp": exp
        }

        token = jwt.encode(payload, settings.ZOOM_SDK_SECRET, algorithm="HS256")
        return Response({"signature": token})

