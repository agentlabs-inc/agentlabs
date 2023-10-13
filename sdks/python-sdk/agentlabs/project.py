from enum import Enum
from typing import Any, Callable, TypedDict
from engineio.middleware import os

import socketio
from agentlabs import realtime

from agentlabs.http import HttpApi
from agentlabs.logger import AgentLogger
from agentlabs.realtime import RealtimeClient
from .agent import Agent

from .server import emit, agent_namespace

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

class IncomingChatMessage:
    def __init__(self, message: _ChatMessage):
        self.text = message["text"]
        self.conversation_id = message["conversationId"]
        self.message_id = message["messageId"]
        self.agent_id = message["agentId"]
        self.member_id = message["memberId"]

class Project:
    _is_connected: bool = False

    def __init__(self, agentlabs_url: str, project_id: str, secret: str) -> None:
        self.is_debug_enabled = bool(os.environ.get('DEBUG', False))
        self.agentlabs_url = agentlabs_url
        self.project_id = project_id
        self._secret = secret
        self._realtime = RealtimeClient(project_id=project_id, secret=secret, url=agentlabs_url)

        self._http = HttpApi(
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
            chat_message = IncomingChatMessage(message=payload['data'])
            fn(chat_message)

        self._realtime.on('chat-message', wrapper, namespace=agent_namespace)

    """
    Connects the project to the AgentLabs server.
    Does not block the main thread by itself, use wait() if this is desired.
    May raise an exception if the connection fails.

    Note that as of now, only one connection per project is permitted. This will be changed very soon.
    """
    def connect(self):
        self._realtime.connect()

    """
    Blocks the main thread until the agent is disconnected
    Useful if you have only one agent and want to keep the program running
    without having to bother with your own loop.
    """
    def wait(self):
        if not self._is_connected:
            raise Exception("Project is not connected. Please call connect() first.")
        self._realtime.wait()

    def disconnect(self):
        if not self._is_connected:
            raise Exception("Project is not connected. Can't end a connection that doesn't exist.")
        self._realtime.disconnect()

    def agent(self, id: str) -> Agent:
        return Agent(
            realtime=self._realtime,
            id=id,
        )
