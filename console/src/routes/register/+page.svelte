<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	import { z as zod } from "zod";
	export let data: PageData;

	const { form, errors, validate } = superForm(data.form, {
		validators: zod.object({
			name: zod.string().min(3).max(20),
			email: zod.string().email(),
			password: zod.string().min(8).max(20)
		})
	});

	const handleValidation = async (e: Event) => {
		e.preventDefault();
		const res = await validate();

		if (!res.valid) {
			console.log(res);
			errors.set(res.errors);
			return;
		}
	};
</script>

<div
	class="flex min-h-screen items-center justify-center bg-background-primary dark:bg-background-primary-dark">
	<div class="p-3 w-full flex flex-col items-center">
		<h1 class="text-body-accent dark:text-body-accent-dark text-4xl font-bold antialiased">
			Welcome!
		</h1>
		<div class="my-5" />
		<div class="w-full sm:w-[320px]">
			<form on:submit={handleValidation}>
				<Input
					bind:value={$form.name}
					label="Name"
					required
					name="name"
					errors={$errors?.name}
					type="text"
					placeholder="Your name" />
				<div class="my-5" />

				<Input
					bind:value={$form.email}
					label="Email"
					required
					name="email"
					errors={$errors?.email}
					type="text"
					placeholder="Your email" />
				<div class="my-5" />
				<Input
					bind:value={$form.password}
					label="Password"
					required
					name="password"
					errors={$errors?.password}
					type="password"
					placeholder="Your password" />
				<div class="my-5" />
				<div class="w-full">
					<Button submit type="primary" fullWidth center>Sign up</Button>
				</div>
			</form>
			<div class="my-7 flex gap-5 justify-between items-center">
				<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
				<span class="text-body-color-primary text-sm antialiased">OR</span>
				<hr class="border-stroke-base dark:border-stroke-base-dark grow" />
			</div>
			<div class="flex flex-col gap-3">
				<AuthProviderButton provider="google" />
			</div>
		</div>
	</div>
</div>
