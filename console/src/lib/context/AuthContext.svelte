<script lang="ts">
	import { writable } from "svelte/store";
	import { setContext } from "svelte";
	import { AUTH_CONTEXT_KEY } from "$lib/context/auth.context";
	import type { User } from "$lib/entities/user/user";

	const userStore = writable<User | null>(null);

	// const auth = onUserStateChanged()...

	const login = (email: string, password: string) => {
		// mocked
		userStore.set({
			id: "1",
			email: "",
			fullName: "John Doe",
			createdAt: new Date()
		});
	};

	const logout = () => {
		userStore.set(null);
	};

	setContext(AUTH_CONTEXT_KEY, { currentUser: userStore, login, logout });
</script>

<slot />
