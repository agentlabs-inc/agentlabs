<script lang="ts">
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import MarkdownRenderer from "$lib/components/markdown/markdown-renderer.svelte";

	export let time: string;
	export let body: string;
	export let from: "USER" | "AGENT" | "SYSTEM";
	export let typewriter = false;

	let bubbleClass: string;

	$: bubbleClass =
		from === "USER"
			? "bg-background-primary dark:bg-background-primary-dark"
			: "bg-background-secondary dark:bg-[#282833]";
</script>

<div class={`${bubbleClass} rounded-md py-5 px-5 antialiased`}>
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0">
				{#if from === "USER"}
					<Avatar
						alt="user avatar"
						src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
				{:else if from === "AGENT"}
					<LetterAvatar>Ag</LetterAvatar>
				{:else}
					<Avatar
						alt="user avatar"
						src="https://uploads-ssl.webflow.com/64ee053fe2278d415220a0b0/64f0b039fb591a9b415a6550_mark-icon.svg"
					/>
				{/if}
			</div>

			<div>
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time}
				</div>
				<div class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7">
						{#if from !== 'USER'}
						<MarkdownRenderer source={body} />
						{:else}
						{body}
						{/if}
				</div>
			</div>
		</div>
	</div>
</div>
