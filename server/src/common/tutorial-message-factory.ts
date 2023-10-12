export class TutorialMessageFactory {
  static createMessage(projectId: string, agentId: string, host: string) {
    return `
# Agent is not connected

It looks like the agent  \`${agentId}\` was never connected to this project.

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

agent = project.agent(id="${agentId}")

def handle_task(message: IncomingChatMessage):
	if message.text == 'ping':
		message.reply('pong')
	else:
		message.reply('I do not understand')

agent.on_chat_message(handle_task)

agent.connect()

agent.wait() # if blocking main thread is desired
\`\`\`

Finally, run the code and you are done!

For more connection options, please refer to the [AgentLabs SDK documentation](https://github.com/agentlabs-inc/agentlabs).

Once your agent is connected for the first time, you won't see this message anymore.
		`;
  }
}
