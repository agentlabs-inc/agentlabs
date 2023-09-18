<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import { Icon, CheckCircle, CursorArrowRays } from "svelte-hero-icons";
	import Button from "$lib/components/common/button/Button.svelte";
	import Spacer from "$lib/components/common/spacer/Spacer.svelte";

	let currentStep: "open-frontend" | "authentication" | "send-message" = "open-frontend";
	$: currentStepIndex = ["open-frontend", "authentication", "send-message"].indexOf(currentStep);

	let user: {
		name: string;
		email: string;
	} | null = null;

	let messages: string[] = [];

	const handleNewUser = () => {
		currentStep = "send-message";

		user = {
			name: "John Doe",
			email: "john@doe.com"
		};
	};

	const handleNewMessage = () => {
		messages = [...messages, "Hello World!"];
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex flex-col items-center max-w-2xl m-auto justify-center">
			<div class="flex gap-2">
				<div class="text-body-success dark:text-body-success-dark">
					<Icon src={CheckCircle} width="30" />
				</div>
				<Typography type="mainSectionTitle">Your Agent UI is ready!</Typography>
			</div>

			<div class="mt-3" />
			<Typography type="subTitle"
				>You can now test your Agent UI to see how it looks.</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-6xl m-auto mt-[-30px]">
			<Card>
				<section class="p-10 antialiased min-h-[200px] grid grid-cols-2 gap-3">
					<div>
						<div class={currentStep === "open-frontend" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 1</Typography>
							<Typography type="sectionTitle">Open your frontend</Typography>
							<Spacer size="sm" />
							<div class="grid grid-cols-2 gap-3">
								<Button
									on:click={() => (currentStep = "authentication")}
									size="bigger"
									leftIcon={CursorArrowRays}>Open my frontend</Button>
							</div>
							<Spacer size="md" />
						</div>
						<div class={currentStep === "authentication" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 2</Typography>
							<Typography type="sectionTitle"
								>Test your authentication portal</Typography>
							<Spacer size="sm" />
							<div class="grid grid-cols-2 gap-3">
								<Button
									on:click={handleNewUser}
									size="default"
									leftIcon={CursorArrowRays}>Authenticate</Button>
							</div>
							<Spacer size="md" />
						</div>
						<div class={currentStep === "send-message" ? "" : "disabled opacity-20"}>
							<Typography type="label">Step 3</Typography>
							<Typography type="sectionTitle">Send a message in the Chat</Typography>
							<Spacer size="sm" />
							<div class="grid grid-cols-2 gap-3">
								<Button
									on:click={handleNewMessage}
									size="bigger"
									leftIcon={CursorArrowRays}>Continue</Button>
							</div>
							<Spacer size="md" />
						</div>
					</div>
					<div class="flex items-center justify-center">
						<div
							class="bg-background-quaternary dark:bg-background-quaternary-dark rounded-md py-4 px-4 flex flex-col items-center justify-center w-full h-full gap-3 relative">
							<div class="w-full flex flex-col gap-3">
								{#if !!user}
									<div
										class="animate-in duration-700 fade-in slide-in slide-in-from-bottom-20">
										<Card>
											<div class="p-4 flex gap-3">
												<span
													class="text-body-accent dark:text-body-accent-dark"
													>New user created!
												</span>
												<span
													class="text-body-base dark:text-body-dark font-semibold"
													>{user.name}</span>
												<span class="text-body-base dark:text-body-dark"
													>{user.email}</span>
											</div>
										</Card>
									</div>
								{/if}
								{#each messages as message}
									<div
										class="animate-in duration-700 fade-in slide-in slide-in-from-bottom-20">
										<Card>
											<div class="p-4 flex gap-3">
												<span
													class="text-body-accent dark:text-body-accent-dark"
													>New frontend message!
												</span>
												<span
													class="text-body-base dark:text-body-dark font-semibold overflow-ellipsis"
													>{message}</span>
											</div>
										</Card>
									</div>
								{/each}
							</div>
							<div
								class="{currentStepIndex < 2
									? ''
									: 'absolute bottom-5 right-5'} rounded-md bg-white p-3 flex items-center justify-center gap-4 text-sm text-body-base">
								<span class="relative flex h-3 w-3">
									<span
										class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
									<span
										class="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
								</span>
								Waiting for events...
							</div>
						</div>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
