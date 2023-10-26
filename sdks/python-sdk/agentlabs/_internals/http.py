from typing import Any, Optional, TypedDict
import requests

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


    def upload(self, path: str, filename: str, data: bytes, mime_type: Optional[str]) -> Any:
        mime_type = mime_type or "application/octet-stream"
        response = self.client.post(self._make_url(path), files={
            "file": (filename, data, mime_type)
        })
        response.raise_for_status()

        return response.json()

    def _make_url(self, path: str):
        return f"{self.agentlabs_url}/api{path}"
