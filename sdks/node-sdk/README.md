# agentlabs node-sdk

A NodeJS SDK that can be used to control an AgentLabs managed AI agent.

## Prerequisites

- NodeJS >= v.18.0.0

## Getting started

Here is a minimal example in which an agent is connected to AgentLabs and prepared to handle user messages.

```typescript
import { Project } from "@agentlabs/node-sdk";

const project = new Project({
	projectId: "fff9fcad-07e0-418b-8037-a2dcc920220e",
	secret: '<PROJECT_SECRET>',
	agentlabsUrl: 'https://app.agentlabs.dev',
});

const agent = project.agent("4b55e242-a614-4c51-9193-12869e6070b3");

agent.onChatMessage((message) => {
    if (message.text === 'ping') {
        message.reply('pong')
    } else {
        message.reply("Sorry, I didn't get that.")
    }
});

agent.connect()
```

## Connecting to a self hosted instance

Connecting to a self hosted instance is done the exact same way as connecting to the cloud version.
All you need to do is to use the right `agentlabsUrl` while initializing the project.

```typescript
const project = new Project({
	projectId: "fff9fcad-07e0-418b-8037-a2dcc920220e",
	secret: '<PROJECT_SECRET>',
	agentlabsUrl: '<SELF_HOSTED_INSTANCE_DOMAIN>',
});
```
