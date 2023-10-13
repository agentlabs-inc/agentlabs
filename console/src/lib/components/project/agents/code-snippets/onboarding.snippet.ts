export const onboardingTypescriptCode = (params: {
	projectId: string;
	projectSlug: string;
	agentId: string;
}) => `\`\`\`typescript
// npm install @agentlabs/node-sdk

import { Attachment, Project, IncomingChatMessage } from 'agentlabs';

function handleChatMessage(message: IncomingChatMessage): void {
    if (message.text !== 'ping') {
        const pingPongRules = Attachment.fromPath('rules.md');
        message.reply('Sorry but I cannot handle that.', [pingPongRules]);
        return;
    }
    message.reply('pong!');
}

const projectConfig = {
    agentlabs_url: "https://${params.projectSlug}.agentlabs.ai",
    project_id: "${params.projectId}",
};

const project = new Project(projectConfig);

const agent = project.agent({ id: "${params.agentId}" });
agent.onChatMessage(handleChatMessage);
`;

export const onboardingPythonCode = (params: {
	projectId: string;
	projectSlug: string;
	agentId: string;
}) => `\`\`\`python
# pip install agentlabs-sdk

from agentlabs import Attachment, Project, IncomingChatMessage

def handle_chat_message(message: IncomingChatMessage):
    if message.text != 'ping':
        ping_pong_rules = Attachment.from_path('rules.md')
        message.reply('Sorry but I cannot handle that.', attachments=[ping_pong_rules])
        return ;
    message.reply('pong!')

project = Project({
    "agentlabs_url": "https://${params.projectSlug}.app.agentlabs.dev",
    "project_id": "${params.projectId}",
})

agent = project.agent(id="${params.agentId}")
agent.on_chat_message(handle_chat_message)`;
