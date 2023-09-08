<script lang="ts">
	import "../app.css";
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

	let bubbles = [
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

	let tasks = [
		{ text: "Add a new post on LinkedIn", status: "done" },
		{ text: "Add another post on LinkedIn", status: "queued" }
	];
</script>

<div class="flex min-h-screen bg-background-primary">
	<div class="relative min-h-full w-[290px]">
		<Sidebar position="left">
			<div class="sticky top-0">
				<div class="py-5 px-5 flex items-center">
					<img alt="AgentLabs Logo" src={logo} />
				</div>
				<SidebarHeader>Available agents</SidebarHeader>
			</div>
		</Sidebar>
	</div>

	<div class="flex flex-col grow bg-background-primary">
		<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
			{#each bubbles as bubble}
				<div class="w-full">
					<Bubble
						from={bubble.from}
						title={bubble.title}
						time={bubble.time}
						body={bubble.body}
						type={bubble.type} />
				</div>
			{/each}
			<div>
				<ProcessingStatus content="Waiting for user confirmation..." />
			</div>
		</div>
		<div
			class="shrink-0 py-3 px-3 w-full sticky bottom-0 border-t border-stroke-primary bg-background-primary flex justify-between items-center">
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
	<div class="relative min-h-full w-[490px]">
		<Sidebar position="right">
			<div class="sticky top-0">
				<div class="py-3 px-3 flex justify-end">
					<Avatar
						alt="avatar"
						src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
				</div>
				<SidebarHeader>Tasks</SidebarHeader>
				<div class="flex flex-col py-3 px-3 gap-3">
					{#each tasks as task}
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
