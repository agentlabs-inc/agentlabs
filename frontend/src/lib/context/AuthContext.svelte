<script lang="ts">
	import { onMount, setContext } from "svelte";
	import { setCurrentUser } from "$lib/context/auth.context";
	import type { User } from "$lib/entities/user/user";

	onMount(() => {
		const user: User = {
			id: "my-id",
			fullName: "John Doe",
			email: "",
			isVerified: true,
			createdAt: new Date()
		};

		setCurrentUser(user);
	});
</script>

<slot />
