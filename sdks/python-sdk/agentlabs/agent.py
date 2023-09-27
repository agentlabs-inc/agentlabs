from typing import Callable, TypedDict
from .attachment import Attachment

class _DecodedUser(TypedDict):
    id: str
    email: str
    name: str
    createdAt: str

class _ChatMessage(TypedDict):
    text: str
    senderType: str
    id: str
    decodedUser: _DecodedUser
    createdAt: str

class User:
    def __init__(self, decoded_user: _DecodedUser):
        self.id = decoded_user["id"]
        self.email = decoded_user["email"]
        self.name = decoded_user["name"]
        self.created_at = decoded_user["createdAt"]

class IncomingChatMessage:
    def __init__(self, message: _ChatMessage):
        self.text = message["text"]
        self.sender_type = message["senderType"]
        self.id = message["id"]
        self.created_at = message["createdAt"]
        self.user = User(message["decodedUser"])

    def reply(self, message: str, attachments: list[Attachment] = []):
        print("Replying to message: " + message)

class Agent:
    def __init__(self, id: str):
        print("Agentlabs App initialized")

    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        pass
