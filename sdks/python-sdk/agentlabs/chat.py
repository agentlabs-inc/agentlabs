from enum import Enum
from typing import TypedDict

from agentlabs._internals.http import HttpApi
from .member import _ApiMember, Member

class _MessageAttachment(TypedDict):
    id: str;
    createdAt: str;
    updatedAt: str;
    name: str;
    mimeType: str;
    checksumSha256: str;
    driver: str;
    sizeBytes: str;

class _ChatMessage(TypedDict):
    text: str
    conversationId: str
    messageId: str
    agentId: str
    member: _ApiMember
    attachments: list[_MessageAttachment]

class MessageFormat(Enum):
    PLAIN_TEXT = "PLAIN_TEXT"
    MARKDOWN = "MARKDOWN"

class IncomingChatMessage:
    """Represents a chat message received from the AgentLabs server.
    """
    def __init__(self, _http: HttpApi, message: _ChatMessage):
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.member_id = message["member"]["id"]
        self.sender = Member(message["member"])
        self.attachments = [MessageAttachment(_http, attachment) for attachment in message["attachments"]]


class MessageAttachment:
    """Represents a file attachment sent in a chat message.
    """
    def __init__(self, _http: HttpApi, attachment: _MessageAttachment):
        self._http = _http
        self.id = attachment["id"]
        self.created_at = attachment["createdAt"]
        self.updated_at = attachment["updatedAt"]
        self.name = attachment["name"]
        self.mime_type = attachment["mimeType"]
        self.checksum_sha256 = attachment["checksumSha256"]
        self.size_bytes = attachment["sizeBytes"]

    def download(self) -> bytes:
        return self._http.download(f"/attachments/downloadById/{self.id}")

    def download_to_file(self, file_path: str) -> None:
        data = self.download()
        with open(file_path, "wb") as file:
            file.write(data)
