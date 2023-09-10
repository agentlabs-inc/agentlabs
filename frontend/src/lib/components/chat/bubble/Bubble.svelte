<script lang="ts">
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import type { ComponentType } from "svelte";
	import type { BubbleType } from "$lib/components/chat/bubble/bubble.types";

	import { A1F9e0, A1F4a1, A1F916 } from "svelte-twitter-emoji";

	export let title: string;
	export let time: string;
	export let body: string;
	export let from: "user" | "agent";

	export let type: BubbleType = 'info';

	let bubbleClass: string;

	$: bubbleClass = from === "user" ? "bg-bubble-bg-primary" : "bg-bubble-bg-secondary";

	const typeToEmoji: Record<BubbleType, ComponentType> = {
		thinking: A1F9e0,
		action: A1F916,
		info: A1F4a1,
		error: A1F4a1,
	};
</script>

<div class={`${bubbleClass} rounded-md py-5 px-5 antialiased`}>
	<div class="mb-3">
		<div class="flex items-center gap-4">
			{#if from === "user"}
				<Avatar
					alt="user avatar"
					src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
			{:else if from === "agent"}
				<svelte:component this={typeToEmoji[type]} class="w-5" />
			{/if}

			<div>
				<div class="text-body-color-primary text-sm">{title}</div>
				<div class="text-body-color-subdued text-xs">{time}</div>
			</div>
		</div>
	</div>
	<div class="text-bubble-body-primary text-sm">{body}</div>
</div>
