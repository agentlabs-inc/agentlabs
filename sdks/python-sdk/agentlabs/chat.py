from enum import Enum
from typing import TypedDict
from .member import _ApiMember, Member

class _ChatMessage(TypedDict):
    text: str
    conversationId: str
    messageId: str
    agentId: str
    member: _ApiMember

class MessageFormat(Enum):
    PLAIN_TEXT = "PLAIN_TEXT"
    MARKDOWN = "MARKDOWN"

class IncomingChatMessage:
    """Represents a chat message received from the AgentLabs server.
    """
    def __init__(self, message: _ChatMessage):
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.member_id = message["member"]["id"]
        self.sender = Member(message["member"])

