<script lang="ts">
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import LetterAvatar from "$lib/components/common/letter-avatar/LetterAvatar.svelte";
	import Typewriter from "svelte-typewriter";

	export let time: string;
	export let body: string;
	export let from: "user" | "agent";
	export let typewriter = false;

	let bubbleClass: string;

	$: bubbleClass =
		from === "user"
			? "bg-background-primary dark:bg-background-primary-dark"
			: "bg-background-secondary dark:bg-[#282833]";
</script>

<div class={`${bubbleClass} rounded-md py-5 px-5 antialiased`}>
	<div class="mb-3">
		<div class="flex gap-4">
			<div class="shrink-0">
				{#if from === "user"}
					<Avatar
						alt="user avatar"
						src="https://media.licdn.com/dms/image/D4E03AQFXJiFpNFWE0A/profile-displayphoto-shrink_100_100/0/1680893451739?e=1699488000&v=beta&t=WiNliB67TjMHbaIycm8u55JDrX82xu9I20jw-b10u4A" />
				{:else if from === "agent"}
					<LetterAvatar>Ag</LetterAvatar>
				{/if}
			</div>

			<div>
				<div class="text-body-subdued dark:text-body-subdued-dark text-xs mb-3">
					{time}
				</div>
				<div class="text-body-accent dark:text-body-accent-dark text-[11pt] leading-7">
					{#if typewriter}
						<Typewriter>
							{body}
						</Typewriter>
					{:else}
						{body}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
