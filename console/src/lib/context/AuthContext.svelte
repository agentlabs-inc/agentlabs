<script lang="ts">
	import { writable } from "svelte/store";
	import { setContext } from "svelte";

	const userStore = writable<{ name: string; email: string } | null>(null);

	// const auth = onUserStateChanged()...

	const login = (email: string, password: string) => {
		// mocked
		userStore.set({
			name: "John",
			email: email
		});
	};

	const logout = () => {
		userStore.set(null);
	};

	setContext("Auth", { currentUser: userStore, login, logout });
</script>

<slot />
