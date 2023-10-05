export class TutorialMessageFactory {
  static createMessage(projectId: string, agentId: string) {
    return `
# Agent is not connected

It looks like the agent  \`${agentId}\` was never connected to this project.

This most likely means that you are the project owner.

To connect your agent backend, all you have to do is to make use of the AgentLabs SDK to initialize a connection.

Using the python SDK, this would look like this:

\`\`\`python
from agentlabs.agent import IncomingChatMessage
from agentlabs.project import Project

project = Project({
    'project_id': '${projectId}',
    'agentlabs_url': 'http://localhost',
	'secret': '<SDK_SECRET_FROM_ADMIN_CONSOLE>'
})

agent = project.agent(id="${agentId}")

def handle_task(message: IncomingChatMessage):
	if message.text === 'ping':
		message.reply('pong')
	else
		message.reply('I do not understand')

agent.on_chat_message(handle_task)

agent.connect()

agent.wait() # if blocking main thread is desired
\`\`\`

For more connection options, please refer to the [AgentLabs SDK documentation](https://agentlabs.ai/docs/sdk/).

Once your agent is connected for the first time, you won't see this message anymore.
		`;
  }
}
