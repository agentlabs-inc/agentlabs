<script>
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";
	import { z } from "zod";
	import { homeRoute } from "$lib/routes";
	import { getAuthContext } from "$lib/context/auth.context";
	import { goto } from "$app/navigation";
	const { login, currentUser } = getAuthContext();

	const form = {
		email: {
			value: "",
			error: ""
		}
	};

	const formSchema = z.object({
		email: z.string().email({
			message: "Please enter a valid email"
		})
	});

	let isLoading = false;

	const onSubmit = async (event) => {
		event.preventDefault();

		isLoading = true;
		const result = formSchema.safeParse({
			email: form.email.value
		});

		if (!result.success) {
			form.email.error = result.error.errors[0].message;
		} else {
			login("John Doe", "pass");
			console.log("goto!", $currentUser);
			await goto(homeRoute.path());
			form.email.error = "";
		}
		isLoading = false;
	};
</script>

<div class="flex min-h-screen items-center justify-center bg-background-primary">
	<div class="p-3 w-full flex flex-col items-center">
		<h1 class="text-body-color-primary text-2xl antialiased">Welcome!</h1>
		<div class="my-5" />
		<div class="w-full sm:w-[320px]">
			<form on:submit={onSubmit}>
				<Input
					bind:value={form.email.value}
					name="email"
					type="text"
					error={form.email.error}
					placeholder="Enter your email" />
				<div class="my-5" />
				<div class="w-full">
					<Button loading={isLoading} submit type="primary" fullWidth center
						>Request code</Button>
				</div>
			</form>
			<div class="my-7 flex gap-5 justify-between items-center">
				<hr class="border-stroke-primary grow" />
				<span class="text-body-color-primary text-sm antialiased">OR</span>
				<hr class="border-stroke-primary grow" />
			</div>
			<div class="flex flex-col gap-3">
				<AuthProviderButton provider="google" />
				<AuthProviderButton provider="github" />
				<AuthProviderButton provider="gitlab" />
			</div>
		</div>
	</div>
</div>
