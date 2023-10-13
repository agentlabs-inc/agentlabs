from datetime import datetime
import os
from typing import Any, Callable
import socketio

class RealtimeClient:
    agent_namespace = '/agent'
    is_connected: bool = False

    def __init__(self, project_id: str, secret: str, url: str):
        self._project_id = project_id
        self._secret = secret
        self._url = url
        self._is_debug_enabled = bool(os.environ.get('DEBUG', False))
        self._io = socketio.Client(logger=self._is_debug_enabled, engineio_logger=self._is_debug_enabled)
    
    def connect(self):
        try:
            self._io.connect(self._url, 
                headers={
                    'x-agentlabs-project-id': self._project_id,
                    'x-agentlabs-sdk-secret': self._secret
                },
                namespaces=[self.agent_namespace],
                transports=['websocket']
            )
            self.is_connected = True
        except Exception as e:
            print(e)
            raise Exception('Failed to connect backend to AgentLabs')

    def disconnect(self):
        if not self.is_connected:
            raise Exception('Not connected')
        self._io.disconnect()

    def on(self, event: str, callback: Callable[[Any], Any]):
        self._io.on(event, callback, namespace=self.agent_namespace)

    def emit(self, event: str, data: Any):
        ts = datetime.now().isoformat()
        self._io.emit(event, {
            "timestamp": ts,
            "data": data
        }, namespace=self.agent_namespace)

    def wait(self):
        self._io.wait()
