import os
from typing import Any, Callable, Dict

from .agent import Agent
from .chat import IncomingChatMessage

from ._internals.http import HttpApi
from ._internals.logger import Logger
from ._internals.realtime import RealtimeClient

class Project:
    """Represents a project on the AgentLabs server.
    This class is used to instantiate a backend connection for
    the configured project.
    """

    _client_logger = Logger(name="Client")
    _server_logger = Logger(name="Server")

    def _log_message(self, payload: Dict[str, Any]):
        message = payload.get('message')
        if not message is None:
            self._server_logger.info(message)

    def _handle_hearbeat(self, payload: Dict[str, Any]):
        if self.is_debug_enabled:
            self._client_logger.debug("Server heartbeat acknowledged.")

        return {
                'ok': True
        }

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
        self._realtime.on('heartbeat', self._handle_hearbeat)
   
    def on_chat_message(self, fn: Callable[[IncomingChatMessage], None]):
        """Defines a handler for when a new chat message is received.
        It will be called each time a member of your project sends a new message.
        """
        def wrapper(payload: Any):
            chat_message = IncomingChatMessage(message=payload['data'])
            fn(chat_message)

        self._realtime.on('chat-message', wrapper)

    def connect(self):
        """Connects the project to the AgentLabs server.
        Does not block the main thread by itself, use wait() if this is desired.
        May raise an exception if the connection fails.

        Note that as of now, only one connection per project is permitted.
        This will be changed very soon.
        """
        self._client_logger.info("Connecting to AgentLabs...")
        self._realtime.connect()

    def wait(self):
        """Blocks the main thread until the agent is disconnected
        Useful if you have only one agent and want to keep the program running
        without having to bother with your own loop.
        """
        self._realtime.wait()

    def disconnect(self):
        """Interrupt the current project backend connection.
        If this is the only backend connection used for the project, the project
        will be considered offline and unusable by members.

        Support for multiple connections per project is not yet implemented
        and will be added soon.
        """
        self._realtime.disconnect()

    def agent(self, id: str) -> Agent:
        """Embodies an agent defined for the project.
        This agent can be used to send and stream messages.
        """
        return Agent(
            realtime=self._realtime,
            id=id,
            http=self._http
        )
