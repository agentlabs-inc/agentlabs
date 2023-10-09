from typing import TypedDict
import requests

from .attachment import Attachment

class HttpApiConfig(TypedDict):
    agentlabs_url: str;
    project_id: str;
    secret: str;

class HttpApi:
    def __init__(self, agentlabs_url: str, project_id: str, secret: str) -> None:
        self.agentlabs_url = agentlabs_url
        self.project_id = project_id
        self.secret = secret
        self.client = requests.Session()
        self.client.params = {
            "projectId": self.project_id
        }
        self.client.headers.update({
            "x-agentlabs-sdk-secret": self.secret,
            "x-agentlabs-project-id": self.project_id,
        })

    def _make_url(self, path: str):
        return self.agentlabs_url + path

    def create_message_attachment(self, agent_id: str, message_id: str, attachment: Attachment):
        url = self._make_url("/agent-attachments/createMessageAttachmentSync")
        res = requests.post(url, params={
            message_id: message_id,
            "projectId": self.project_id,
            "agentId": agent_id
        }, files={
            "file": attachment.buffer
        })
        res.raise_for_status()
