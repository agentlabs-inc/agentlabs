from enum import Enum
import os
from typing import Any, Callable, TypedDict
from socketio.pubsub_manager import uuid
from .http import HttpApi

from agentlabs.logger import AgentLogger

from .server import emit, agent_namespace
import socketio

class MessageFormat(Enum):
    PLAIN_TEXT = "PLAIN_TEXT"
    MARKDOWN = "MARKDOWN"

class _DecodedUser(TypedDict):
    id: str
    email: str
    name: str
    createdAt: str

class _ChatMessage(TypedDict):
    text: str
    conversationId: str
    messageId: str
    agentId: str
    memberId: str

class User:
    def __init__(self, decoded_user: _DecodedUser):
        self.id = decoded_user["id"]
        self.email = decoded_user["email"]
        self.name = decoded_user["name"]
        self.created_at = decoded_user["createdAt"]

class StreamedChatMessage:
    is_ended: bool = False

    def __init__(self, io: socketio.Client, conversation_id: str, format: MessageFormat):
        self.io = io
        self.conversation_id = conversation_id
        self.message_id = str(uuid.uuid4())
        self.format = format

    """
    Writes a token to the stream. This can be used to send a message in multiple parts.
    Writing to a stream on which end() has been called will raise an exception.
    """
    def write(self, token: str):
        if self.is_ended:
            raise Exception("Cannot write to a stream that has already been ended.")

        emit(self.io, 'stream-chat-message-token', {
            "conversationId": self.conversation_id,
            "messageId": self.message_id,
            "text": token,
            "attachments": [],
            "format": self.format.value
        })

    """
    Ends the stream. After a stream is ended it cannot be written to anymore, and
    doing so will raise an exception.
    """
    def end(self):
        self.is_ended = True
        emit(self.io, 'stream-chat-message-end', {
            "conversationId": self.conversation_id,
            "messageId": self.message_id
        })


class IncomingChatMessage:
    def __init__(self, http: HttpApi,io: socketio.Client, message: _ChatMessage):
        self.io = io
        self.http = http
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.agent_id = message["agentId"]
        self.member_id = message["memberId"]

    """
    Creates a new streamed reply to this message. This can be used to send a message
    in multiple parts.
    Well suited to stream LLM outputs.
    """
    def streamed_reply(self, format: MessageFormat = MessageFormat.PLAIN_TEXT):
        return StreamedChatMessage(self.io, self.conversation_id, format)

    """
    Replies to the message instantly. If you are looking to stream a reply in multiple parts,
    use streamed_reply() instead.
    """
    def reply(self, message: str, format: MessageFormat = MessageFormat.PLAIN_TEXT):
        emit(self.io, 'chat-message', {
            "conversationId": self.conversation_id,
            "text": message,
            "attachments": [],
            "format": format.value
        })

        # TODO: we'll come back to this when we officially support attachments
        #for attachment in attachments:
        #    try:
        #        self.http.create_message_attachment(
        #                agent_id=self.agent_id,
        #                message_id=self.message_id,
        #                attachment=attachment
        #        )
        #    except Exception as e:
        #        print(f"Failed to create message attachment {attachment.name}: {e}")

class Agent:
    is_connected: bool = False

    def _log_message(self, data: dict[str, Any]):
        message = data.get('message', None)

        if not message is None:
            self._server_logger.info(message)

    def __init__(self, agent_id: str, project_id: str, secret: str, agentlabs_url: str) -> None:
        self.project_id = project_id
        self.agent_id = agent_id
        self.secret = secret
        self.agentlabs_url = agentlabs_url
        self.is_debug_enabled = bool(os.environ.get('DEBUG', False))
        self.io = socketio.Client(logger=self.is_debug_enabled, engineio_logger=self.is_debug_enabled)
        self.io.on('message', self._log_message, namespace=agent_namespace)
        self._client_logger = AgentLogger(agent_id=agent_id, name="Client")
        self._server_logger = AgentLogger(agent_id=agent_id, name="Server")
        self.http = HttpApi(
            project_id=project_id,
            agentlabs_url=agentlabs_url,
            secret=secret
        )


    """
    Defines a handler for when a new chat message is received.
    It will be called each time a user sends a new message to the agent from the AgentLabs UI.
    """
    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        def wrapper(payload: Any):
            chat_message = IncomingChatMessage(http=self.http, io=self.io, message=payload['data'])
            fn(chat_message)

        self.io.on('chat-message', wrapper, namespace=agent_namespace)

    """
    Connects the agent to the AgentLabs server.
    Does not block the main thread by itself, use wait() if this is desired.
    May raise an exception if the connection fails.

    Note that as of now, only one connection per agent is permitted. This will be changed very soon.
    """
    def connect(self):
        self._client_logger.info("Connecting to AgentLabs server...")
        self.io.connect(url=self.agentlabs_url, namespaces=[agent_namespace], transports=['websocket'], headers={
            "x-agentlabs-project-id": self.project_id,
            "x-agentlabs-agent-id": self.agent_id,
            "x-agentlabs-sdk-secret": self.secret,
            "user-agent": "agentlabs-python-sdk"
            })
        self.is_connected = True

    """
    Blocks the main thread until the agent is disconnected
    Useful if you have only one agent and want to keep the program running
    without having to bother with your own loop.
    """
    def wait(self):
        if not self.is_connected:
            raise Exception("Agent is not connected, please call connect() before calling wait().")
        self._client_logger.info("Blocking main thread until agent is disconnected.")
        self.io.wait()

    """
    Abruptly disconnects the agent from the server
    """
    def terminate(self):
        self.io.disconnect()
