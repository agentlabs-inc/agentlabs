import os
from typing import Any, Callable, Set, TypedDict

from agentlabs.logger import AgentLogger

from .server import emit, agent_namespace, emit_sync
from .attachment import Attachment
import socketio

class AgentConfig(TypedDict):
    agentlabs_url: str;
    project_id: str;
    agent_id: str;

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

class IncomingChatMessage:
    def __init__(self, io: socketio.Client, message: _ChatMessage):
        self.io = io
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.agent_id = message["agentId"]
        self.member_id = message["memberId"]

    def reply(self, message: str, attachments: list[Attachment] = []):
        emit(self.io, 'chat-message', {
            "conversationId": self.conversation_id,
            "text": message,
        })
        print("Replying to message: " + message)

class Agent:
    is_connected: bool = False

    def _log_message(self, data: dict[str, Any]):
        message = data.get('message', None)

        if not message is None:
            self._server_logger.info(message)

    def __init__(self, config: AgentConfig):
        self.is_debug_enabled = bool(os.environ.get('DEBUG', False))
        self.config = config
        self.io = socketio.Client(logger=self.is_debug_enabled, engineio_logger=self.is_debug_enabled)
        self.io.on('message', self._log_message, namespace=agent_namespace)
        self._client_logger = AgentLogger(agent_id=config['agent_id'], name="Client")
        self._server_logger = AgentLogger(agent_id=config['agent_id'], name="Server")

    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        def wrapper(payload: Any):
            chat_message = IncomingChatMessage(self.io, payload['data'])
            fn(chat_message)

        self.io.on('chat-message', wrapper, namespace=agent_namespace)

    def on_heartbeat(self, fn: Callable[[], None]):
        def wrapper(_: dict):
            fn()

        self.io.on('heartbeat', wrapper, namespace=agent_namespace)

    def connect(self):
        self._client_logger.info("Connecting to AgentLabs server...")
        self.io.connect(url=self.config['agentlabs_url'], namespaces=[agent_namespace], transports=['websocket'], headers={
            "x-agentlabs-project-id": self.config['project_id'],
            "x-agentlabs-agent-id": self.config['agent_id'],
            "user-agent": "agentlabs-python-sdk"
            })
        self.is_connected = True

    # Blocks the main thread until the agent is disconnected
    # Useful if you have only one agent and want to keep the program running
    # without having to bother with your own loop.
    def wait(self):
        if not self.is_connected:
            raise Exception("Agent is not connected, please call connect() before calling wait().")
        self._client_logger.info("Blocking main thread until agent is disconnected.")
        self.io.wait()

    # Abruptly disconnects the agent from the server
    def terminate(self):
        self.io.disconnect()
