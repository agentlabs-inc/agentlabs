from typing import TypedDict
import requests

from .attachment import Attachment

class HttpApiConfig(TypedDict):
    agentlabs_url: str;
    project_id: str;
    agent_id: str;

# base url pattern
class HttpApi:
    def __init__(self, config: HttpApiConfig):
        self.config = config
        self.client = requests.Session()
        self.client.params = {
            "projectId": config["project_id"],
            "agentId": config["agent_id"]
        }

    def _make_url(self, path: str):
        return self.config["agentlabs_url"] + path

    def create_message_attachment(self, message_id: str, attachment: Attachment):
        url = self._make_url("/agent-attachments/createMessageAttachmentSync")
        res = requests.post(url, params={
            message_id: message_id,
            "projectId": self.config["project_id"],
            "agentId": self.config["agent_id"]
        }, files={
            "file": attachment.buffer
        })
        res.raise_for_status()
