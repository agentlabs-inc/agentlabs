<script lang="ts">
	import "../../app.css";
	import logo from "$lib/assets/img/logo-white.svg";
	import Bubble from "$lib/components/chat/bubble/Bubble.svelte";
	import ProcessingStatus from "$lib/components/chat/processing-status/ProcessingStatus.svelte";
	import Sidebar from "$lib/components/sidebar/Sidebar.svelte";
	import SidebarHeader from "$lib/components/sidebar/header/SidebarHeader.svelte";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import CardBody from "$lib/components/common/card/CardBody.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { Forward } from "svelte-hero-icons";
	import { chat } from "$lib/store/chat/chat";
	import { afterUpdate, onMount } from "svelte";
	import { agentsService } from "../../services/agents-service";
	import type { AgentInfo } from "../../services/agents.types";

	let defaultBubbles = [
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "user",
			title: "Feedback",
			time: "11:00 PM",
			body: "You must stop this now",
			type: undefined
		},
		{
			from: "agent",
			title: "Task Added - Find more relevant articles",
			time: "11:00 PM",
			body: "You must stop this now",
			type: "info"
		},
		{
			from: "agent",
			title: "Thinking - Trying to plan new posts",
			time: "11:00 PM",
			body: "You must stop this now",
			type: "thinking"
		},
		{
			from: "agent",
			title: "Action - Searching on Google",
			time: "11:00 PM",
			body: "Based on the result I found on Google it seems Hacker News is a great source to find new ideas. I am about to post a new artice there.",
			type: "action"
		}
	] as const;

	let chatBubbles = [] as any[];

	let tasks = [
	] as any[]

	let agentInfos: AgentInfo[] = [];
	let selectedAgentInfo: AgentInfo | null = null;

	const handleAgentSelection = (agentInfo: AgentInfo) => {
		selectedAgentInfo = agentInfo;
	}

	let currentTaskInputValue = "";

	const handleTaskSubmission = () => {
		tasks = [...tasks, { text: currentTaskInputValue, status: "queued" }];
		agentsService.addTask(selectedAgentInfo!.id, currentTaskInputValue);
		currentTaskInputValue = ""
	}

	onMount(() => {
		agentsService.onAgentListChange((infos) => {
			agentInfos = infos;
		});

		agentsService.onTaskError((payload) => {
			chatBubbles = [
				...chatBubbles,
				{
					from: "agent",
					title: "Task errored",
					time: "11:00 PM",
					body: payload.data.error,
					type: "info"
				}
			]
		})

		agentsService.onLlmStart((payload) => {
			chatBubbles = [
				...chatBubbles,
				{
					from: "agent",
					title: "Thinking...",
					time: "11:00 PM",
					body: 'Thinking...',
					type: "thinking",
					isThinking: true
				}
			]
		})

		agentsService.onLlmEnd((payload) => {
			const thinkingBubble = chatBubbles.findLast(bubble => bubble.isThinking);

			if (!thinkingBubble) {
				throw new Error("No thinking bubble found");
			}

			const bubble = {
				...thinkingBubble,
				title: 'Thought',
				body: payload.data.text,
				isThinking: false
			}

			chatBubbles = [
				...chatBubbles.filter(bubble => bubble !== thinkingBubble),
				bubble
			]
		})

		agentsService.onToolStart((payload) => {
			chatBubbles = [
				...chatBubbles,
				{
					from: "agent",
					title: "Using " + payload.data.tool_name + " tool",
					time: "11:00 PM",
					body: 'Starting tool "' + payload.data.tool_name + '"' + " with input " + payload.data.tool_input + '".',
					type: "action",
					isUsingTool: true
				}
			]
		})

		agentsService.onToolEnd((payload) => {
			const usingToolBubble = chatBubbles.findLast(bubble => bubble.isUsingTool);


			if (!usingToolBubble) {
				throw new Error("No using tool bubble found");
			}

			const bubble = {
				...usingToolBubble,
				title: 'Tool finished',
				body: payload.data.tool_output,
				isUsingTool: false
			}

			chatBubbles = [
				...chatBubbles.filter(bubble => bubble !== usingToolBubble),
				bubble
			]
		})
	})



	afterUpdate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	})

	$: console.log(agentInfos);
</script>

<div class="flex min-h-screen bg-background-primary">
	<div class="shrink-0 relative min-h-full w-[290px]">
		<Sidebar position="left">
			<div class="sticky top-0">
				<div class="py-5 px-5 flex items-center">
					<img alt="AgentLabs Logo" src={logo} />
				</div>
				<SidebarHeader>Available agents</SidebarHeader>
				<div>
					{#each agentInfos as agentInfo}
						<button on:click={() => handleAgentSelection(agentInfo)} class="border-b border-stroke-primary py-3 px-3 flex items-center gap-3 font-medium text-tab-label-primary antialiased hover:opacity-80 w-full">
							<img alt="avatar" class="w-6 h-6 rounded-full" src={agentInfo.logoUrl} />
							<div class="flex flex-col">
								<div class="text-sm">{agentInfo.name}</div>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</Sidebar>
	</div>


	<div class="flex flex-col grow bg-background-primary"
			>
		{#if selectedAgentInfo}
		<div class="flex flex-col grow gap-4 py-4 px-3 items-start"
			>
			{#if chatBubbles.length > 0}
				{#each chatBubbles as bubble}
					<div class="w-full">
						<Bubble
							from={bubble.from}
							title={bubble.title}
							time={bubble.time}
							body={bubble.body}
							type={bubble.type} />
					</div>
				{/each}
			{:else}
				<div class="flex items-center justify-center w-full">
					<h2 class="text-white antialiased text-xl mt-24">Add your first task to get started.</h2>
				</div>
			{/if}
		</div>
		{/if}
		{#if !selectedAgentInfo}
		<div class="flex flex-col grow gap-4 py-4 items-start">
			<div class="w-full flex items-center flex-col mt-48 relative">
				<div class="flex items-center">
					<h2 class="font-semibold text-white text-3xl antialiased">AgentLabs</h2>
					<div class="bg-white/90 ml-3 font-semibold rounded-md px-2">
					POC
					</div>
				</div>
				<p class="text-white/90 antialiased mt-4">Select an agent on your left to get started.</p>
			</div>
		</div>
		{/if}

		<div
			class="shrink-0 py-3 px-3 w-full sticky bottom-0 border-t border-stroke-primary bg-background-primary flex justify-between items-center"
			class:opacity-50={!selectedAgentInfo}
		>
			<div>
				<Button on:click={chat.interrupt} type="secondary">Interrupt with Feedback</Button>
			</div>
			<div class="flex items-center gap-3">
				<Button on:click={chat.continue}>Continue</Button>
				<Button on:click={chat.activateContinuous} type="secondary" leftIcon={Forward}
					>Continuous mode</Button>
			</div>
		</div>
	</div>

	<div class="shrink-0 relative min-h-full w-[490px]">
		<Sidebar position="right">
			<div class="sticky top-0">
				<div class="py-3 px-3 flex justify-end">
					<Avatar
						alt="avatar"
						src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
				</div>
				<SidebarHeader>Tasks</SidebarHeader>
				<div class="flex flex-col py-3 px-3 gap-3">
					<form class="flex items-center gap-x-4"
						on:submit|preventDefault={handleTaskSubmission} 
					>
						<input bind:value={currentTaskInputValue}  placeholder="New task" type="text" class="text-sm w-full border border-stroke-primary bg-card-bg-primary text-card-body-primary rounded-md py-3 px-3" />
						<Button submit type="primary">Add</Button>
					</form>
					{#each tasks as task (task.text)}
						<Card>
							<CardBody>
								{task.text}
							</CardBody>
						</Card>
					{/each}
				</div>
			</div>
		</Sidebar>
	</div>
</div>
