from asgiref.sync import sync_to_async
from .models import Message  # if you store chat in DB
from django.contrib.auth.models import User
from .asgi import sio

# When user connects
@sio.event
async def connect(sid, environ, auth):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

# Handle incoming message
@sio.event
async def send_message(sid, data):
    """
    data = {
        "sender": "user",
        "text": "Hello world",
        "room": "chat_1"
    }
    """
    room = data.get("room")

    # Save message in DB (optional)
    # await sync_to_async(Message.objects.create)(
    #     sender=data["sender"],
    #     text=data["text"],
    #     room=room
    # )

    # Broadcast message to everyone in the room
    await sio.emit("receive_message", data, room=room)

@sio.event
async def join_room(sid, data):
    """
    data = { "room": "chat_1" }
    """
    await sio.save_session(sid, {"room": data["room"]})
    await sio.enter_room(sid, data["room"])
    print(f"{sid} joined {data['room']}")

