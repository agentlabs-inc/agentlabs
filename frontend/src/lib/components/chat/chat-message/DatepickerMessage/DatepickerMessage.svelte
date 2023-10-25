<script lang="ts">
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import { getAgentById } from "$lib/stores/agent";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";
	import { getMainContextStore } from "$lib/stores/main-context";
	import TypingLoader from "$lib/components/chat/chat-message/TypingLoader.svelte";
	import type { ChatMessageFormat } from "$lib/stores/chat";
	import { createEventDispatcher, onMount } from "svelte";
	import Datepicker from "$lib/components/chat/chat-message/DatepickerMessage/Datepicker.svelte";
	import type {
		DatepickerOptions,
		DatepickerSelectEvent,
		DatepickerSelectEventData
	} from "./Datepicker.svelte";

	export let time: string;
	export let format: ChatMessageFormat;
	export let body: string;
	export let agentId: string;
	export let datepickerOptions: DatepickerOptions;

	let showTypingLoader = false;

	let bubbleClass: string;

	$: bubbleClass = "bg-background-secondary dark:bg-[#282833]";

	const agent = getAgentById(agentId);

	$: letter = agent ? agent.name[0] + agent.name[1] : "?";

	if (!agent) {
		throw new Error("Agent not found");
	}

	const projectConfig = getMainContextStore().publicProjectConfig;

	if (!projectConfig) throw new Error("Project config not found");

	let submitting = false;

	const dispatchEvent = createEventDispatcher<{
		select: DatepickerSelectEventData;
	}>();

	const onSelect = (event: DatepickerSelectEvent) => {
		dispatchEvent("select", {
			isRange: event.detail.isRange,
			date: event.detail.date,
			formattedDate: event.detail.formattedDate
		});
	};

	onMount(() => {
		showTypingLoader = true;
		setTimeout(() => {
			showTypingLoader = false;
		}, 1000);
	});
</script>

<div class="{bubbleClass} rounded-md py-5 px-5 antialiased">
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0" title={agent.name}>
				<LetterAvatar>{letter}</LetterAvatar>
			</div>

			<div class="flex flex-col flex-grow relative overflow-x-scroll">
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time} - {agent.name}
				</div>
				<div
					class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7 w-full">
					{#if showTypingLoader}
						<div class="">
							<TypingLoader />
						</div>
					{:else if format === "MARKDOWN"}
						<MarkdownRenderer source={body} />
					{:else}
						{body}
					{/if}
				</div>
				{#if !showTypingLoader}
					<div
						class="animate-in fade-in mt-3 max-w-[290px] bg-background-primary border border-stroke-base dark:bg-background-primary-dark dark:border-stroke-base-dark rounded-lg">
						<div class="p-4 flex items-center justify-center">
							<Datepicker on:select={onSelect} options={datepickerOptions} />
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
