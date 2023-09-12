<script>
	import Button from "$lib/components/common/button/Button.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";

	const spacingClass = `py-4 px-6`;

	const onClick = () => {};
</script>

<div class="flex min-h-screen items-center justify-center bg-background-primary">
	<div class="p-3 w-full flex flex-col items-center">
		<h1 class="text-body-color-primary text-2xl antialiased">Welcome!</h1>
		<div class="my-5" />
		<div class="w-full sm:w-[320px]">
			<form>
				<div class="flex flex-col">
					<input
						type="email"
						name="email"
						id="email"
						class="bg-input-bg-primary border border-input-stroke-primary text-input-label-primary focus:outline-0 rounded-sm text-sm placeholder-input-label-primary {spacingClass} antialiased"
						placeholder="Your email address" />
				</div>
				<div class="my-5" />
				<div class="w-full">
					<Button submit type="primary" center on:click={onClick}>Request code</Button>
				</div>
			</form>
			<div class="my-5" />
			<AuthProviderButton provider="google" />
		</div>
	</div>
</div>
