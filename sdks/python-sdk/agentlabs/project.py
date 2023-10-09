from typing import TypedDict
from .agent import Agent

class Project:
    registered_agent_ids: list[str] = []

    def __init__(self, agentlabs_url: str, project_id: str, secret: str) -> None:
        self.agentlabs_url = agentlabs_url
        self.project_id = project_id
        self.secret = secret

    def agent(self, id: str) -> Agent:
        is_registered = id in self.registered_agent_ids
        if is_registered:
            raise Exception(f"Agent with id {id} already registered")
        self.registered_agent_ids.append(id)

        return Agent(
            agent_id= id,
            project_id=self.project_id,
            agentlabs_url=self.agentlabs_url,
            secret=self.secret
        )
