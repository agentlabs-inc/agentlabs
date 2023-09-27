<script lang="ts">
	import "../../app.css";
	import logo from "$lib/assets/img/logo-white.svg";
	import Bubble from "$lib/components/chat/bubble/Bubble.svelte";
	import Sidebar from "$lib/components/sidebar/Sidebar.svelte";
	import SidebarHeader from "$lib/components/sidebar/header/SidebarHeader.svelte";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import CardBody from "$lib/components/common/card/CardBody.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import Button from "$lib/components/common/button/Button.svelte";
	import { Forward, PaperAirplane } from "svelte-hero-icons";
	import { chat } from "$lib/store/chat/chat";
	import { afterUpdate, onMount } from "svelte";
	import { agentsService } from "../../services/agents-service";
	import type { AgentInfo } from "../../services/agents.types";
	import ChatInput from "$lib/components/chat/chat-input/ChatInput.svelte";

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

	let tasks = [] as any[];

	let agentInfos: AgentInfo[] = [];
	let selectedAgentInfo: AgentInfo | null = null;

	const handleAgentSelection = (agentInfo: AgentInfo) => {
		selectedAgentInfo = agentInfo;
	};

	let currentTaskInputValue = "";

	const handleTaskSubmission = () => {
		tasks = [...tasks, { text: currentTaskInputValue, status: "queued" }];
		agentsService.addTask(selectedAgentInfo!.id, currentTaskInputValue);
		currentTaskInputValue = "";
	};

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
			];
		});

		agentsService.onLlmStart((payload) => {
			chatBubbles = [
				...chatBubbles,
				{
					from: "agent",
					title: "Thinking...",
					time: "11:00 PM",
					body: "Thinking...",
					type: "thinking",
					isThinking: true
				}
			];
		});

		agentsService.onLlmEnd((payload) => {
			const thinkingBubble = chatBubbles.findLast((bubble) => bubble.isThinking);

			if (!thinkingBubble) {
				throw new Error("No thinking bubble found");
			}

			const bubble = {
				...thinkingBubble,
				title: "Thought",
				body: payload.data.text,
				isThinking: false
			};

			chatBubbles = [...chatBubbles.filter((bubble) => bubble !== thinkingBubble), bubble];
		});

		agentsService.onToolStart((payload) => {
			chatBubbles = [
				...chatBubbles,
				{
					from: "agent",
					title: "Using " + payload.data.tool_name + " tool",
					time: "11:00 PM",
					body:
						'Starting tool "' +
						payload.data.tool_name +
						'"' +
						" with input " +
						payload.data.tool_input +
						'".',
					type: "action",
					isUsingTool: true
				}
			];
		});

		agentsService.onToolEnd((payload) => {
			const usingToolBubble = chatBubbles.findLast((bubble) => bubble.isUsingTool);

			if (!usingToolBubble) {
				throw new Error("No using tool bubble found");
			}

			const bubble = {
				...usingToolBubble,
				title: "Tool finished",
				body: payload.data.tool_output,
				isUsingTool: false
			};

			chatBubbles = [...chatBubbles.filter((bubble) => bubble !== usingToolBubble), bubble];
		});
	});

	afterUpdate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});

	$: console.log(agentInfos);

	let inputValue = "";
</script>

<div class="flex h-full flex-col justify-between">
	<div class="flex flex-col grow bg-background-primary dark:bg-background-secondary-dark">
		{#if selectedAgentInfo}
			<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
				{#if defaultBubbles.length > 0}
					{#each defaultBubbles as bubble}
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
						<h2 class="text-white antialiased text-xl mt-24">
							Add your first task to get started.
						</h2>
					</div>
				{/if}
			</div>
		{/if}
		{#if !selectedAgentInfo}
			<div class="flex flex-col grow gap-4 py-4 items-start">
				<div class="w-full flex items-center flex-col mt-48 relative">
					<div class="flex items-center">
						<h2
							class="font-semibold text-body-accent dark:text-body-accent-dark text-3xl antialiased">
							AgentLabs
						</h2>
						<div
							class="text-body-subdued dark:text-body-subdued-dark ml-3 font-semibold rounded-md px-2 bg-background-tertiary dark:bg-background-tertiary-dark">
							POC
						</div>
					</div>
					<p class="text-body-subdued dark:text-body-subdued antialiased mt-4">
						Select an agent on your left to get started.
					</p>
				</div>
			</div>
		{/if}
	</div>
	<!-- -->
	<div
		class="flex items-center justify-center py-3 px-3 border-t border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark flex-grow-0">
		<div class="flex-grow max-w-4xl">
			<div class="flex items-center justify-between gap-3">
				<div class="w-full">
					<ChatInput
						bind:value={inputValue}
						name="chat-input"
						placeholder="Send a message" />
				</div>
				<div class="h-full flex">
					<Button rightIcon={PaperAirplane} />
				</div>
			</div>
		</div>
	</div>
</div>
