from typing import Any, Callable, Dict
import os

from .http import HttpApi
from .logger import Logger
from .realtime import RealtimeClient

from .types import _ChatMessage
from .agent import Agent

class IncomingChatMessage:
    def __init__(self, message: _ChatMessage):
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.member_id = message["memberId"]

class Project:
    _client_logger = Logger(name="Client")
    _server_logger = Logger(name="Server")

    def _log_message(self, payload: Dict[str, Any]):
        message = payload.get('message')
        if not message is None:
            self._server_logger.info(message)

    def __init__(self, agentlabs_url: str, project_id: str, secret: str) -> None:
        self.is_debug_enabled = bool(os.environ.get('DEBUG', False))
        self.agentlabs_url = agentlabs_url
        self.project_id = project_id
        self._secret = secret
        self._http = HttpApi(
            project_id=project_id,
            agentlabs_url=agentlabs_url,
            secret=secret
        )
        self._realtime = RealtimeClient(project_id=project_id, secret=secret, url=agentlabs_url)
        self._realtime.on('message', self._log_message)
    
    """
    Defines a handler for when a new chat message is received.
    It will be called each time a user sends a new message to the agent from the AgentLabs UI.
    """
    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        def wrapper(payload: Any):
            chat_message = IncomingChatMessage(message=payload['data'])
            fn(chat_message)

        self._realtime.on('chat-message', wrapper)

    """
    Connects the project to the AgentLabs server.
    Does not block the main thread by itself, use wait() if this is desired.
    May raise an exception if the connection fails.

    Note that as of now, only one connection per project is permitted. This will be changed very soon.
    """
    def connect(self):
        self._client_logger.info("Connecting to AgentLabs...")
        self._realtime.connect()

    """
    Blocks the main thread until the agent is disconnected
    Useful if you have only one agent and want to keep the program running
    without having to bother with your own loop.
    """
    def wait(self):
        self._realtime.wait()

    def disconnect(self):
        self._realtime.disconnect()

    def agent(self, id: str) -> Agent:
        return Agent(
            realtime=self._realtime,
            id=id,
        )
