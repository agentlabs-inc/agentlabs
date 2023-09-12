<script>
	import Button from "$lib/components/common/button/Button.svelte";
	import Input from "$lib/components/common/input/Input.svelte";
	import AuthProviderButton from "$lib/components/auth/button/AuthProviderButton.svelte";

	const onClick = () => {};
</script>

<div class="flex min-h-screen items-center justify-center bg-background-primary">
	<div class="p-3 w-full flex flex-col items-center">
		<h1 class="text-body-color-primary text-2xl antialiased">Welcome!</h1>
		<div class="my-5" />
		<div class="w-full sm:w-[320px]">
			<form>
				<Input error="this is error" type="text" placeholder="Enter your email" />
				<div class="my-5" />
				<div class="w-full">
					<Button submit type="primary" center on:click={onClick}>Request code</Button>
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
