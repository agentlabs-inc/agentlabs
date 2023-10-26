from typing import Set
from uuid import uuid4

from agentlabs._internals.http import HttpApi

from .attachment import AttachmentItem, _LocalFileAttachment, _UploadedAttachment
from .chat import MessageFormat
from ._internals.realtime import RealtimeClient
from ._internals.utils import chunk_str
from ._internals.const import (
    DEFAULT_STREAM_TOKEN_SIZE,
    DEFAULT_MESSAGE_TYPING_INTERVAL_MS,
    DEFAULT_INITIAL_MESSAGE_LOADING_DELAY_MS
)
import time

class AgentStream:
    """Creates a stream to send a message in multiple parts.
        This is done by making successive calls to write() and then calling end() when done.
    """
    is_ended: bool = False

    def __init__(self, realtime: RealtimeClient, agent_id: str, conversation_id: str, format: MessageFormat):
        self.conversation_id = conversation_id
        self.message_id = str(uuid4())
        self.format = format
        self._realtime = realtime
        self.agent_id = agent_id
        self._start(self.message_id)

    def _start(self, token: str):
        if self.is_ended:
            raise Exception("Cannot write to a stream that has already been ended.")

        self._realtime.emit('stream-chat-message-start', {
            "conversationId": self.conversation_id,
            "messageId": self.message_id,
            "attachments": [],
            "format": self.format.value,
            "agentId": self.agent_id
        })

    def write(self, token: str):
        """Writes a token to the stream. This can be used to send a message in multiple parts.
        Writing to a stream on which end() has been called will raise an exception.
        """
        if self.is_ended:
            raise Exception("Cannot write to a stream that has already been ended.")

        self._realtime.emit('stream-chat-message-token', {
            "conversationId": self.conversation_id,
            "messageId": self.message_id,
            "text": token,
            "attachments": [],
            "format": self.format.value,
            "agentId": self.agent_id
        })


    def typewrite(
        self,
        token: str,
        interval_ms: int = DEFAULT_MESSAGE_TYPING_INTERVAL_MS
        ):
        """Sends a stream to a conversation, with a typewriter animation.
        Such message will be displayed smoothly to the user with a nice typewriter animation.
        """
        chunks = chunk_str(token, DEFAULT_STREAM_TOKEN_SIZE)
        for chunk in chunks:
            self.write(chunk)
            time.sleep(interval_ms / 1000)

        self.end()

    def end(self):
        """
        Ends the stream. After a stream is ended it cannot be written to anymore, and
        doing so will raise an exception.
        """
        self.is_ended = True
        self._realtime.emit('stream-chat-message-end', {
            "conversationId": self.conversation_id,
            "messageId": self.message_id,
            "agentId": self.agent_id
        })

class Agent:
    def __init__(self, id: str, realtime: RealtimeClient, http: HttpApi) -> None:
        self._realtime = realtime
        self._http = http
        self.id = id

    def _upload_attachment(self, attachment: AttachmentItem) -> _UploadedAttachment:
        uploaded_attachment = None

        if isinstance(attachment, _LocalFileAttachment):
            attachment.load()
            uploaded_attachment = self._http.upload('/attachments/uploadSync',
                    data=attachment.data,
                    filename=attachment.filename,
                    mime_type=attachment.mime_type
            )

        if uploaded_attachment is None:
            raise Exception("Could not upload attachment")

        return uploaded_attachment

    def echart(self, conversation_id: str, echart: dict, text = '', text_format: MessageFormat = MessageFormat.PLAIN_TEXT):
        """Sends an [echart](https://echarts.apache.org/en/index.html) chart to a conversation, with an optional text message attached.

        The echart parameter holds the chart configuration, including styling and data, and should only contain JSON serializable values.
        Because echart is a Javascript library, this python SDK does not provide strong typing for the echart parameter.

        You may want to refer to the examples from [this page](https://echarts.apache.org/examples/en/index.html) to get an idea of what the echart parameter should look like.
        """
        self._realtime.emit('chat-message', {
            "conversationId": conversation_id,
            "text": text,
            "agentId": self.id,
            "source": "AGENT",
            "format": text_format.value,
            "attachments": [],
            "type": "ECHART",
            "metadata": echart
        });

    def send(self, text: str, conversation_id: str, format: MessageFormat = MessageFormat.PLAIN_TEXT, attachments: list[AttachmentItem] = []):
        """Sends a message to a conversation.
        Such message will be communicated instantly to the conversation.
        """
        uploaded_attachments: list[_UploadedAttachment] = [self._upload_attachment(attachment) for attachment in attachments]

        self._realtime.emit('chat-message', {
            "conversationId": conversation_id,
            "text": text,
            "agentId": self.id,
            "source": "AGENT",
            "format": format.value,
            "attachments": uploaded_attachments
        })

    def create_stream(self, conversation_id: str, format: MessageFormat) -> AgentStream:
        """Creates a stream to send a message in multiple parts.
        This is done by making successive calls to write() and then calling end() when done.
        """
        return AgentStream(self._realtime, self.id, conversation_id, format)

    def typewrite(
        self,
        text: str,
        conversation_id: str,
        format: MessageFormat = MessageFormat.PLAIN_TEXT,
        initial_delay_ms: int = DEFAULT_INITIAL_MESSAGE_LOADING_DELAY_MS,
        interval_ms: int = DEFAULT_MESSAGE_TYPING_INTERVAL_MS
        ):
        """Sends a message to a conversation, with a typewriter animation.
        Such message will be displayed smoothly to the user with a nice typewriter animation and loading
        indicator.
        """
        stream = self.create_stream(conversation_id, format)

        if (initial_delay_ms > 0):
            time.sleep(initial_delay_ms / 1000)

        stream.typewrite(text, interval_ms)

        stream.end()
