from typing import TypedDict
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

    def _make_url(self, path: str):
        return self.agentlabs_url + path
