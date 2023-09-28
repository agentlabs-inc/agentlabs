from typing import Any, Optional, TypedDict
import socketio
from datetime import datetime
import time

agent_namespace = '/agent'

class ServerError(TypedDict):
     code: str
     message: str
     context: Optional[dict]

class ServerMessage(TypedDict):
    data: dict
    error: Optional[ServerError]
    timestamp: str

def emit(io: socketio.Client, event: str, data: dict, error: Optional[ServerError] = None):
    now = datetime.now().isoformat()
    io.emit(event, {
        "data": data,
        "error": error,
        "timestamp": now
        }, namespace='/agent')

def emit_sync(io: socketio.Client, event: str, data: dict, error: Optional[ServerError] = None, acknowledgement_timeout_seconds: int = 10) -> dict[str, Any]:
    now = datetime.now().isoformat()
    acknowledgment = None
    
    def register_callback(data: ServerMessage):
        nonlocal acknowledgment
        acknowledgment = data

    io.emit(event, {
        "data": data,
        "error": error,
        "timestamp": now
        }, namespace='/agent', callback=register_callback)

    elapsed = 0

    while not acknowledgment and elapsed < acknowledgement_timeout_seconds:
        time.sleep(0.1)
        elapsed += 0.1

    if not acknowledgment:
        raise Exception(f"Timeout waiting for acknowledgement for event {event}")

    return acknowledgment
