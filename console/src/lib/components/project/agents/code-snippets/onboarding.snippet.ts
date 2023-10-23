import { buildFrontendUrl } from "$lib/utils/buildFrontendUrl";

export const onboardingTypescriptCode = (params: {
	projectId: string;
	projectSlug: string;
	agentId: string;
}) => `\`\`\`typescript
// npm install @agentlabs/node-sdk
import { Project } from "@agentlabs/node-sdk";

const project = new Project({
    projectId: "${params.projectId}",
    secret: "your-secret",
    url: "https://${params.projectSlug}.app.agentlabs.dev",
});

const agent = project.agent("${params.agentId}");

project.onChatMessage(async (message) => {
    if (message.text === 'ping') {
        agent.send({
            text: 'pong',
            conversationId: message.conversationId,
        });
        return;
    }
    agent.send({
		text: "I don't understand.",
		conversationId: message.conversationId,
	});
});

project.connect();`;

export const onboardingPythonCode = (params: {
	projectId: string;
	projectSlug: string;
	agentId: string;
}) => `\`\`\`python
# pip install agentlabs-sdk
from agentlabs.chat import IncomingChatMessage
from agentlabs.project import Project

def handle_message(message: IncomingChatMessage):
    if message.text == "ping":
        agent.send(
            conversation_id=message.conversation_id,
            text="pong",
        )
    else:
        agent.send(
            conversation_id=message.conversation_id,
            text="I don't understand.",
        )
        
project = Project(
    project_id="${params.projectId}",
    agentlabs_url="https://${params.projectSlug}.app.agentlabs.dev",
    secret="your-secret",
)

agent = project.agent(id="${params.agentId}")
project.on_chat_message(handle_message)

project.connect()
project.wait()
`;

export const embedCode = (projectSlug: string) => {
	return `\`\`\`html
<iframe
src="${buildFrontendUrl(projectSlug)}"
width="100%"
style="height: 100%; min-height: 700px"
frameborder="0"
></iframe>
\`\`\``;
};
