<script lang="ts">
	import TopCover from "$lib/components/common/top-cover/TopCover.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import Card from "$lib/components/common/card/Card.svelte";
	import type { PageData } from "../../../../../.svelte-kit/types/src/routes";
	import { z as zod } from "zod";
	import { superForm } from "sveltekit-superforms/client";
	import { Icon, Envelope } from "svelte-hero-icons";
	import Avatar from "$lib/components/common/avatar/Avatar.svelte";
	import GoogleIcon from "$lib/components/auth/GoogleIcon.svelte";
	import GitlabIcon from "$lib/components/auth/GitlabIcon.svelte";
	import GithubIcon from "$lib/components/auth/GithubIcon.svelte";

	export let data: PageData;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			name: zod.string().min(3).max(20)
		}),
		validationMethod: "oninput"
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			errors.set(res.errors);
			return;
		}
	};
</script>

<div>
	<TopCover>
		<section class="p-12 flex flex-col items-center max-w-2xl m-auto justify-center">
			<Typography type="mainSectionTitle">Your authentication portal</Typography>
			<div class="mt-3" />
			<Typography type="subTitle"
				>AgentLabs will handle the authentication for you so you don't have to think about
				it.</Typography>
		</section>
	</TopCover>
	<div class="w-full">
		<div class="max-w-6xl m-auto mt-[-30px]">
			<Card>
				<section class="p-10 antialiased min-h-[200px] grid grid-cols-2 gap-3">
					<div>
						<Typography type="sectionTitle">Branding</Typography>
						<Typography type="subTitle">
							Configure the branding of the authentication page.
						</Typography>
						<div class="my-10" />
						<Typography type="sectionTitle">Sign in methods</Typography>
						<Typography type="subTitle">
							Choose the methods your users can use to login.
						</Typography>
						<div class="my-10" />
						<div class="grid grid-cols-2 gap-3">
							<div
								class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={Envelope} width="20" class="text-body-subdued" />
								</div>
								<div>Anonymous</div>
							</div>
							<div
								class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={Envelope} width="20" class="text-body-subdued" />
								</div>
								<div>Passwordless email</div>
							</div>
							<div
								class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={Envelope} width="20" class="text-body-subdued" />
								</div>
								<div>Email and password</div>
							</div>
							<div
								class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={Envelope} width="20" class="text-body-subdued" />
								</div>
								<div>Google / Gmail</div>
							</div>
							<div
								class="antialiased border rounded-md p-3 border-stroke-base dark:border-stroke-base-dark flex items-center justify-left gap-3 text-body-base dark:text-body-base-dark hover:bg-background-accent dark:hover:bg-background-accent-dark cursor-pointer">
								<div
									class="rounded-full border border-stroke-base dark:border-stroke-base-dark p-3 bg-background-secondary dark:bg-background-secondary-dark">
									<Icon src={Envelope} width="20" class="text-body-subdued" />
								</div>
								<div>Microsoft</div>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-center">
						<div
							class="bg-blue-700 rounded-md py-10 px-10 flex items-center justify-center">
							<div
								class="rounded-md bg-white p-3 flex flex-col items-center justify-center gap-4">
								<Avatar
									alt="Logo icon"
									src="https://avatars.githubusercontent.com/u/54212400?v=4" />
								<div class="w-[100px] bg-[#F5F5F5] h-3 rounded-full" />
								<div
									class="w-[200px] bg-[#292946] py-2 rounded-md text-sm text-center text-white">
									Sign in
								</div>
								<div class="w-[100px] bg-[#F5F5F5] h-3 rounded-full" />
								<div
									class="w-[200px] bg-gray-200 py-2 rounded-md flex items-center justify-center">
									<GoogleIcon />
								</div>
								<div
									class="w-[200px] bg-gray-200 py-2 rounded-md flex items-center justify-center">
									<GitlabIcon />
								</div>
							</div>
						</div>
					</div>
				</section>
			</Card>
		</div>
	</div>
</div>
