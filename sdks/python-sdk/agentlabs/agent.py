import os
from typing import Any, Callable, Set, TypedDict
import requests
from .http import HttpApi

from agentlabs.logger import AgentLogger

from .server import emit, agent_namespace, emit_sync
from .attachment import Attachment
import socketio

from agentlabs import attachment

class AgentConfig(TypedDict):
    agentlabs_url: str;
    project_id: str;
    agent_id: str;
    secret: str;

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
    def __init__(self, http: HttpApi,io: socketio.Client, message: _ChatMessage):
        self.io = io
        self.http = http
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.agent_id = message["agentId"]
        self.member_id = message["memberId"]

    def reply(self, message: str, attachments: list[Attachment] = []):
        attachment_payloads = list(map(lambda attachment: {
            "name": attachment.name,
        }, attachments))

        emit(self.io, 'chat-message', {
            "conversationId": self.conversation_id,
            "text": message,
            "attachments": attachment_payloads
        })

        # TODO: parallelize this
        for attachment in attachments:
            try:
                self.http.create_message_attachment(
                        agent_id=self.agent_id,
                        message_id=self.message_id,
                        attachment=attachment
                )
            except Exception as e:
                print(f"Failed to create message attachment {attachment.name}: {e}")

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
        self.http = HttpApi({
            "project_id": config['project_id'],
            "agentlabs_url": config['agentlabs_url'],
            "secret": config['secret']
        })

    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        def wrapper(payload: Any):
            chat_message = IncomingChatMessage(http=self.http, io=self.io, message=payload['data'])
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
            "x-agentlabs-sdk-secret": self.config['secret'],
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
