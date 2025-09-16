# yourproject/asgi.py
import os
import django
from django.core.asgi import get_asgi_application
import socketio  # make sure socketio is imported

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# ✅ Setup Django BEFORE importing your socket code
django.setup()

# Import after django.setup()
from communication.messaging.socket import sio  

django_asgi_app = get_asgi_application()
application = socketio.ASGIApp(sio, django_asgi_app)

