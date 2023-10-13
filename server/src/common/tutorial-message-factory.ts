export class TutorialMessageFactory {
  static createMessage(projectId: string, host: string) {
    return `
# No backend connected to this project

It looks like no backend was ever connected to this project.

This most likely means that you are the project owner.

To connect your agent backend, all you have to do is to make use of the AgentLabs SDK to initialize a connection.

Here is a short tutorial on how to do it in Python:

First, install the SDK:

\`\`\`shell
pip install agentlabs-sdk
\`\`\`

Then, write basic code to handle incoming chat messages:

\`\`\`python
from agentlabs.agent import IncomingChatMessage
from agentlabs.project import Project

project = Project(
    project_id='${projectId}',
    agentlabs_url='https://${host}',
	secret='<SDK_SECRET_FROM_ADMIN_CONSOLE>'
)

def handle_task(message: IncomingChatMessage):
	print(f"Received message {message.text} from member with ID {message.member_id} in conversation {message.conversation_id}")

project.on_chat_message(handle_task)

project.connect()

project.wait() # if blocking main thread is desired
\`\`\`

Finally, run the code and you are done!

For more connection options, please refer to the [AgentLabs SDK documentation](https://github.com/agentlabs-inc/agentlabs).

Once your agent is connected for the first time, you won't see this message anymore.
		`;
  }
}
