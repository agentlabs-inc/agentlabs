from dataclasses import dataclass
import time
from types import FunctionType
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema import AgentAction, AgentFinish, LLMResult
import socketio
from typing import Any, Callable, Dict, List, Optional, TypedDict, Union
import os
from langchain.utils.input import print_text


class AgentInfo(TypedDict):
    id: str
    name: str
    logo_url: Optional[str]

class Task(TypedDict):
    text: str
    id: str

class ChainStreamer(BaseCallbackHandler):
    run_id_to_metadata: dict[str, dict[str, Any]] = {}

    def __init__(self, io: socketio.Client, task_id: str):
        self.io = io
        self.task_id = task_id

    def on_chain_start(
            self, serialized: dict[str, Any], prompts: list[str], **kwargs: Any
    ) -> Any:
        run_id = kwargs['run_id']
        parent_run_id = kwargs['parent_run_id']
        run_id = str(run_id)
        name: str | None = None;

        if parent_run_id is None:
            return

        if not parent_run_id is None:
            parent_run_id = str(parent_run_id)

        metadata = kwargs['metadata']
        self.run_id_to_metadata[run_id] = metadata

        if not metadata is None:
            name = metadata.get('name')

        self.io.emit('agents/tasks/chain_start', {
            'data': {
                'run_id': run_id,
                'parent_run_id': parent_run_id,
                'name': name,
            },
            'task': {
                'id': self.task_id,
            }
        })

    def on_chain_end(self, outputs: dict[str, Any], **kwargs: Any) -> Any:
        run_id = kwargs['run_id']
        parent_run_id = kwargs['parent_run_id']
        run_id = str(run_id)
        
        if parent_run_id is None:
            return

        if not parent_run_id is None:
            parent_run_id = str(parent_run_id)

        metadata = self.run_id_to_metadata[run_id]

        self.io.emit('agents/tasks/chain_end', {
            'data': {
                'run_id': run_id,
                'parent_run_id': parent_run_id,
                'name': metadata.get('name'),
            },
            'task': {
                'id': self.task_id,
             }
        })

class AgentStreamer(BaseCallbackHandler):

    def __init__(self, io: socketio.Client, task: Task):
        self.io = io
        self.color = None
        self.task = task

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        self.io.emit('agents/tasks/llm_start', {
            'data': {
                'prompts': prompts,
            },
            'task': {
                'id': self.task['id'],
            }
        })
        pass

    def on_llm_end(self, response: LLMResult, **kwargs: Any) -> None:
        text = response.generations[0][0].text;
        self.io.emit('agents/tasks/llm_end', {
            'data': {
                'text': text,
            },
            'task': {
                'id': self.task['id'],
            }
        })

    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        """Do nothing."""
        pass

    def on_llm_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        self.io.emit('agents/tasks/llm_error', {
            'data': {
                'error': str(error),
            },
            'task': {
                'id': self.task['id'],
            }
        })

    def on_chain_start(
        self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs: Any
    ) -> None:
        """Print out that we are entering a chain."""
        class_name = serialized.get("name", serialized.get("id", ["<unknown>"])[-1])
        print(f"\n\n\033[1m> Entering new {class_name} chain...\033[0m")

    def on_chain_end(self, outputs: Dict[str, Any], **kwargs: Any) -> None:
        """Print out that we finished a chain."""
        print("\n\033[1m> Finished chain.\033[0m")

    def on_chain_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        self.io.emit('agents/tasks/chain_error', {
            'data': {
                'error': error,
            },
            'task': {
                'id': self.task['id'],
            }
        })

    def on_tool_start(
        self,
        serialized: Dict[str, Any],
        input_str: str,
        **kwargs: Any,
    ) -> None:
        """Do nothing."""
        tool_name = serialized.get("name", serialized.get("id", ["<unknown>"])[-1])
        self.io.emit('agents/tasks/tool_start', {
            'data': {
                'tool_input': input_str,
                'tool_name': tool_name,
            },
            'task': {
                'id': self.task['id'],
            }
        })

    def on_agent_action(
        self, action: AgentAction, color: Optional[str] = None, **kwargs: Any
    ) -> Any:
        """Run on agent action."""
        #print_text(action.log, color=color or self.color)

    def on_tool_end(
        self,
        output: str,
        color: Optional[str] = None,
        observation_prefix: Optional[str] = None,
        llm_prefix: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        """If not the final action, print out observation."""
        #if observation_prefix is not None:
        #    print_text(f"\n{observation_prefix}")
        #print_text(output, color=color or self.color)
        #if llm_prefix is not None:
        #    print_text(f"\n{llm_prefix}")
        self.io.emit('agents/tasks/tool_end', {
            'data': {
                'tool_output': output,
            },
            'task': {
                'id': self.task['id'],
            }
        })

    def on_tool_error(
        self, error: Union[Exception, KeyboardInterrupt], **kwargs: Any
    ) -> None:
        """Do nothing."""
        self.io.emit('agents/tasks/tool_error', {
            'data': {
                'tool_error': str(error),
            },
            'task': {
                'id': self.task['id'],
            }
        })
        pass

    def on_text(
        self,
        text: str,
        color: Optional[str] = None,
        end: str = "",
        **kwargs: Any,
    ) -> None:
        thought_index = text.find('Thought:')

        if thought_index != -1:
            text = text[thought_index:]
            print("Thought", text)

    def on_agent_finish(
        self, finish: AgentFinish, color: Optional[str] = None, **kwargs: Any
    ) -> None:
        pass
        #print_text("----------------------------------------------------", color=color or self.color, end="\n")
        #print_text(finish.log, color=color or self.color, end="\n")
        #print_text("----------------------------------------------------", color=color or self.color, end="\n")


class AgentLabsApp():
    is_connected: bool = False
    max_connection_attempts = 10
    connection_attempt_delay = 2

    def declare(self):
        self.io.emit('agents/declare', {
            'id': self.agentInfo['id'],
            'name': self.agentInfo['name'],
            'logoUrl': self.agentInfo['logo_url'],
        })

    def log_message(self, data):
        print("message", data)

    def __init__(self, agentInfo: AgentInfo):
        server_url = os.getenv('AGENTLABS_SERVER_URL')

        if server_url is None:
            raise Exception("AGENTLABS_SERVER_URL environment variable is not set, but is required to connect to AgentLabs server.")

        self.server_url = server_url
        self.agentInfo = agentInfo
        self.io = socketio.Client()

    def on_task(self, fn: Callable[[Task], None]):
        def wrapper(task):
            try:
                fn(task)
            except Exception as error:
                self.io.emit('agents/tasks/error', {
                    'data': {
                        'error': str(error),
                    },
                    'task': {
                        'id': task['id'],
                    }
                })

        self.io.on('task_added', wrapper)

    def make_agent_streamer(self, task: Task) -> AgentStreamer:
        return AgentStreamer(self.io, task)

    def connect(self) -> None:
        attempts = 0

        while attempts < self.max_connection_attempts:
            try:
                self.io.connect(
                        url=self.server_url,
                        headers={
                            "User-Agent": "agentlabs-agent"
                        },
                        transports=['websocket'],

                )
                self.declare()

                break
            except:
                print("Failed to connect to AgentLabs server, retrying in 2 seconds...")
                time.sleep(self.connection_attempt_delay)
                attempts += 1

        if attempts >= self.max_connection_attempts:
            raise Exception("Failed to connect to AgentLabs server after 10 attempts.")

        self.is_connected = True
