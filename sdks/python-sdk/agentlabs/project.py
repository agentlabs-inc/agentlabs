from typing import TypedDict
from .agent import Agent

class ProjectConfig(TypedDict):
    agentlabs_url: str
    project_id: str

class Project:
    registered_agent_ids: list[str] = []

    def __init__(self, config: ProjectConfig) -> None:
        self.config = config

    def agent(self, id: str) -> Agent:
        is_registered = id in self.registered_agent_ids
        if is_registered:
            raise Exception(f"Agent with id {id} already registered")
        self.registered_agent_ids.append(id)

        return Agent(id)
