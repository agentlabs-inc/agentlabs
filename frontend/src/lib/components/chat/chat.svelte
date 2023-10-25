<script lang="ts">
	import {
		addActiveStream,
		addMessage,
		addStreamedMessageToken,
		chatStore,
		isStreaming,
		removeActiveStream
	} from "$lib/stores/chat";
	import type { ChatMessageFormat, ChatMessageSource } from "$lib/stores/chat";
	import { EyeSlash, Heart, PaperAirplane, Plus, Star } from "svelte-hero-icons";
	import Button from "../common/button/Button.svelte";
	import ChatInput from "./chat-input/ChatInput.svelte";
	import ChatMessage from "./chat-message/ChatMessage.svelte";
	import dayjs from "dayjs";
	import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
	import {
		addConversation,
		conversationStore,
		generateConversationId
	} from "$lib/stores/conversation";
	import { realtimeStore } from "$lib/stores/realtime";
	import { afterNavigate, goto } from "$app/navigation";
	import { authStore } from "$lib/stores/auth";
	import { v4 as uuidv4 } from "uuid";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";
	import { mainContextStore } from "$lib/stores/main-context";
	import AgentChatMessage from "./chat-message/AgentChatMessage.svelte";
	import { chatConversationRoute } from "$lib/routes/routes";
	import LoginMessage from "$lib/components/chat/chat-message/LoginMessage.svelte";
	import SelectMessage from "$lib/components/chat/chat-message/SelectMessage/SelectMessage.svelte";
	import PromptMessage from "$lib/components/chat/chat-message/PromptMessage.svelte";
	import type { MultiSelectChoice } from "$lib/components/chat/chat-message/SelectMessage/multi-select/types";
	import EChartMessage from "$lib/components/chat/chat-message/EChartMessage/EChartMessage.svelte";
	import { themeStore } from "$lib/stores/theme";
	import DatepickerMessage from "$lib/components/chat/chat-message/DatepickerMessage/DatepickerMessage.svelte";

	let chatElement: HTMLDivElement;
	let chatInputElement: HTMLInputElement;
	let isWaitingForAnswer = false;
	let chatInputValue = "";
	let isUserInteractionBlocked = false;

	$: memberId = $authStore.member?.id;

	$: isChatDisabled = isWaitingForAnswer || $isStreaming;

	$: messages = $chatStore.messages;
	$: conversationId = $conversationStore.selectedConversationId;

	const projectId = $mainContextStore.publicProjectConfig?.id;

	if (!projectId) {
		throw new Error("Project id is not defined");
	}

	let shouldRedirectToConversation = false;

	let displayLoginMessage: null | {
		format: ChatMessageFormat;
		text: string;
		agentId: string;
		timestamp: string;
	} = null;
	const onLoginRequested = (payload: {
		data: {
			messageId: string;
			conversationId: string;
			source: ChatMessageSource;
			agentId: string;
			format: ChatMessageFormat;
			text: string;
		};
		timestamp: string;
	}) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(
				`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`
			);

			return;
		}

		if ($mainContextStore.publicProjectConfig?.authMethods?.length === 0) {
			return;
		}

		isWaitingForAnswer = false;
		isUserInteractionBlocked = true;

		addMessage({
			id: payload.data.messageId,
			text: payload.data.text,
			source: payload.data.source,
			createdAt: payload.timestamp,
			format: payload.data.format,
			agentId: payload.data.agentId,
			type: "LOGIN_REQUEST",
			attachments: []
		});
	};

	const isInIFrame = () => {
		return window?.parent?.location !== window.location;
	};

	const sendMessage = (e: Event) => {
		e.preventDefault();

		const con = $realtimeStore.connection;

		if (!con) {
			return;
		}

		if (!conversationId) {
			shouldRedirectToConversation = true;
		}

		const actualConversationId = conversationId ?? generateConversationId();

		const timestamp = new Date().toISOString();
		const payload = {
			timestamp,
			data: {
				text: chatInputValue,
				conversationId: actualConversationId,
				source: "USER" as ChatMessageSource
			}
		};

		chatElement.scrollTop = chatElement.scrollHeight;

		addMessage({
			id: uuidv4(), // this is a fake id, the real id will be set by the server
			...payload.data,
			createdAt: timestamp,
			format: "PLAIN_TEXT",
			type: "CONVERSATION_MESSAGE",
			attachments: []
		});

		isWaitingForAnswer = true;
		isUserInteractionBlocked = true;
		$conversationStore.selectedConversationId = actualConversationId;

		con.emit("chat-message", payload);

		chatInputValue = "";
	};

	const makeConversation = async () => {
		if (!memberId || !conversationId) {
			return;
		}

		const timestamp = new Date().toISOString();

		addConversation({
			id: conversationId,
			projectId,
			memberId,
			createdAt: timestamp,
			updatedAt: timestamp
		});
		await goto(chatConversationRoute.path(conversationId));
	};

	const listenToStreamChatMessageEnd = (payload: any) => {
		const messageId = payload.data.messageId;

		removeActiveStream(messageId);

		isUserInteractionBlocked = false;
		isWaitingForAnswer = false;

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}
	};

	const listenToChatMessage = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(
				`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`
			);

			return;
		}

		if (shouldRedirectToConversation) {
			makeConversation();
			shouldRedirectToConversation = false;
		}

		isWaitingForAnswer = false;
		isUserInteractionBlocked = false;

		addMessage({
			id: payload.data.messageId,
			text: payload.data.text,
			source: payload.data.source,
			createdAt: payload.timestamp,
			format: payload.data.format,
			agentId: payload.data.agentId,
			type: "CONVERSATION_MESSAGE",
			attachments: payload.data.attachments
		});
	};

	const listenToStreamedChatMessageToken = (payload: any) => {
		if (payload.data.conversationId !== conversationId) {
			console.warn(
				`Received message for conversation ${payload.data.conversationId} but current conversation is ${conversationId}`
			);

			return;
		}

		const messageId = payload.data.messageId;

		addActiveStream(messageId);

		isWaitingForAnswer = false;

		addStreamedMessageToken({
			id: payload.data.messageId,
			text: payload.data?.text ?? "",
			source: "AGENT",
			createdAt: payload.timestamp,
			format: payload.data.format,
			agentId: payload.data.agentId,
			type: "CONVERSATION_MESSAGE",
			attachments: []
		});
	};

	afterNavigate(() => {
		if (!isInIFrame) {
			chatInputElement?.focus();
		}
	});

	$: if (chatInputElement) {
		if (!isInIFrame()) {
			chatInputElement.focus();
		}
	}

	onMount(async () => {
		$realtimeStore.connection?.on("chat-message", listenToChatMessage);
		$realtimeStore.connection?.on("login-request", onLoginRequested);
		$realtimeStore.connection?.on(
			"stream-chat-message-start",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.on(
			"stream-chat-message-token",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.on("stream-chat-message-end", listenToStreamChatMessageEnd);
	});

	onDestroy(() => {
		$realtimeStore.connection?.off("chat-message", listenToChatMessage);
		$realtimeStore.connection?.off(
			"stream-chat-message-token",
			listenToStreamedChatMessageToken
		);
		$realtimeStore.connection?.off("stream-chat-message-end", listenToStreamChatMessageEnd);
		$realtimeStore.connection?.disconnect();
	});

	let chatElementScrollHeight = 0;
	let chatElementScrollTop = 0;
	let chatElementClientHeight = 0;

	beforeUpdate(() => {
		if (chatElement) {
			chatElementScrollHeight = chatElement.scrollHeight;
			chatElementScrollTop = chatElement.scrollTop;
			chatElementClientHeight = chatElement.clientHeight;
		}
	});

	afterUpdate(() => {
		if (chatElement) {
			// if chat element is scrolled to the bottom, scroll to the bottom again
			if (chatElementScrollHeight - chatElementScrollTop === chatElementClientHeight) {
				chatElement.scrollTop = chatElement.scrollHeight;
			}
		}
	});

	$: projectName = $mainContextStore.publicProjectConfig?.name;

	// MOCKED DATA: you can remove it once everything is implemented.
	const choices: MultiSelectChoice[] = [
		{
			id: "some-id",
			label: "Pepsi",
			value: "Value A",
			heroIcon: Heart
		},
		{
			id: "some-id-2",
			label: "Coca-Cola",
			value: "Value b",
			heroIcon: Heart
		},
		{
			id: "some-id-3",
			label: "Perrier",
			value: "Value b",
			heroIcon: Heart
		}
	];

	function func(x: any) {
		x /= 10;
		return Math.sin(x) * Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * 50;
	}
	function generateData() {
		let data = [];
		for (let i = -200; i <= 200; i += 0.1) {
			data.push([i, func(i)]);
		}
		return data;
	}

	const eChartOptions = {
		grid: {
			top: 40,
			left: 50,
			right: 40,
			bottom: 50
		},
		xAxis: {
			name: "x",
			minorTick: {
				show: true
			},
			minorSplitLine: {
				show: true
			}
		},
		yAxis: {
			name: "y",
			min: -100,
			max: 100,
			minorTick: {
				show: true
			},
			minorSplitLine: {
				show: true
			}
		},
		dataZoom: [
			{
				show: true,
				type: "inside",
				filterMode: "none",
				xAxisIndex: [0],
				startValue: -20,
				endValue: 20
			},
			{
				show: true,
				type: "inside",
				filterMode: "none",
				yAxisIndex: [0],
				startValue: -20,
				endValue: 20
			}
		],
		series: [
			{
				type: "line",
				showSymbol: false,
				clip: true,
				data: generateData()
			}
		]
	};

	const eChartOptions2 = {
		xAxis: {
			type: "category",
			data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
		},
		yAxis: {
			type: "value"
		},
		series: [
			{
				data: [
					120,
					{
						value: 200,
						itemStyle: {
							color: "#a90000"
						}
					},
					150,
					80,
					70,
					110,
					130
				],
				type: "bar"
			}
		]
	};

	const eChartOptions3 = {
		title: [
			{
				text: "Radial Polar Bar Label Position (middle)"
			}
		],
		polar: {
			radius: [30, "80%"]
		},
		radiusAxis: {
			max: 4
		},
		angleAxis: {
			type: "category",
			data: ["a", "b", "c", "d"],
			startAngle: 75
		},
		tooltip: {},
		series: {
			type: "bar",
			data: [2, 1.2, 2.4, 3.6],
			coordinateSystem: "polar",
			label: {
				show: true,
				position: "middle",
				formatter: "{b}: {c}"
			}
		},
		animation: false
	};

	const eChartOptions4 = {
		xAxis: {
			data: [
				"2017-10-24",
				"2017-10-25",
				"2017-10-26",
				"2017-10-27",
				"2017-10-28",
				"2017-10-29",
				"2017-10-30",
				"2017-10-31",
				"2017-11-01",
				"2017-11-02",
				"2017-11-03",
				"2017-11-04",
				"2017-11-05",
				"2017-11-06",
				"2017-11-07",
				"2017-11-08",
				"2017-11-09",
				"2017-11-10"
			]
		},
		yAxis: {},
		series: [
			{
				type: "candlestick",
				data: [
					[20, 34, 10, 38],
					[40, 35, 30, 50],
					[31, 38, 33, 44],
					[38, 15, 5, 42],
					[20, 34, 10, 38],
					[40, 35, 30, 50],
					[31, 38, 33, 44],
					[38, 15, 5, 42],
					[20, 34, 10, 38],
					[40, 35, 30, 50],
					[31, 38, 33, 44],
					[38, 15, 5, 42],
					[20, 34, 10, 38],
					[40, 35, 30, 50],
					[31, 38, 33, 44],
					[38, 15, 5, 42],
					[20, 34, 10, 38],
					[40, 35, 30, 50],
					[31, 38, 33, 44],
					[38, 15, 5, 42]
				]
			}
		]
	};
	// END OF MOCKED DATA.
</script>

<div class="flex flex-col justify-between relative flex-grow">
	<div
		bind:this={chatElement}
		class="absolute top-0 bottom-[80px] left-0 right-0 overflow-y-scroll bg-background-primary dark:bg-background-secondary-dark">
		{#if messages?.length > 0}
			<div class="flex flex-col grow gap-4 py-4 px-3 items-start">
				{#each messages as message, index (message.id)}
					<div class="w-full">
						{#if message.agentId}
							{#if message.type === "LOGIN_REQUEST"}
								<LoginMessage
									time={dayjs(message.createdAt).format("M/D/YYYY hh:mm A")}
									body={message.text}
									format={message.format}
									agentId={message.agentId} />
							{:else}
								<AgentChatMessage
									isLoading={isWaitingForAnswer && messages.length - 1 === index}
									time={dayjs(message.createdAt).format("M/D/YYYY hh:mm A")}
									body={message.text}
									format={message.format}
									agentId={message.agentId}
									attachments={message.attachments} />
							{/if}
							<SelectMessage
								minSelected={1}
								maxSelected={2}
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="What brand do you love the most?"
								choices={choices}
								agentId={message.agentId} />
							<Spacer />
							<PromptMessage time="22h00" agentId={message.agentId} />
							<Spacer />
							<EChartMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="Here's the chart you asked for"
								chartOptions={eChartOptions}
								theme={$themeStore}
								agentId={message.agentId} />
							<Spacer />
							<EChartMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="Here's the chart you asked for"
								chartOptions={eChartOptions2}
								theme={$themeStore}
								agentId={message.agentId} />
							<Spacer />
							<EChartMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="Here's the chart you asked for"
								chartOptions={eChartOptions3}
								theme={$themeStore}
								agentId={message.agentId} />
							<Spacer />
							<EChartMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="Here's the chart you asked for"
								chartOptions={eChartOptions4}
								theme={$themeStore}
								agentId={message.agentId} />
							<Spacer />

							<DatepickerMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="PLAIN_TEXT"
								body="Pick the date that works best for you"
								agentId={message.agentId}
								datepickerOptions={{}}
								on:select={(e) =>
									alert(`you selected a date ${e.detail.formattedDate}`)} />

							<Spacer />

							<DatepickerMessage
								time={dayjs().format("M/D/YYYY hh:mm A")}
								format="MARKDOWN"
								body="Pick the date **RANGE** that works best for you"
								agentId={message.agentId}
								datepickerOptions={{
									range: true,
									minDate: new Date(),
									maxDate: dayjs().add(2, "week").toDate()
								}}
								on:select={(e) =>
									alert(`you selected a date range ${e.detail.formattedDate}`)} />
						{:else}
							<ChatMessage
								isLoading={isWaitingForAnswer && messages.length - 1 === index}
								from={message.source}
								time={dayjs(message.createdAt).format("M/D/YYYY hh:mm A")}
								body={message.text}
								format={message.format} />
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div class="mt-32 flex flex-col items-center">
				<div class="flex items-center">
					<h2
						class="text-body-base dark:text-body-base-dark font-semibold text-3xl antialiased">
						{projectName}
					</h2>
				</div>
				<Spacer size="xs" />
				<div>
					<Typography type="subTitle"
						>Send a message to start interacting with the agent.</Typography>
				</div>
			</div>
		{/if}
	</div>
	<div
		class="absolute bottom-0 left-0 right-0 flex items-center justify-center py-3 px-3 border-t border-stroke-base dark:border-stroke-base-dark bg-background-secondary dark:bg-background-primary-dark flex-grow-0">
		<div class="flex-grow max-w-4xl">
			<form class="w-full items-center flex gap-3" on:submit|preventDefault={sendMessage}>
				<div class="flex-1">
					<ChatInput
						bind:inputElement={chatInputElement}
						bind:value={chatInputValue}
						name="chat-input"
						placeholder="Send a message" />
				</div>
				<Button
					submit
					loading={isChatDisabled}
					disabled={isChatDisabled || chatInputValue.length === 0}
					rightIcon={PaperAirplane} />
			</form>
		</div>
	</div>
</div>
