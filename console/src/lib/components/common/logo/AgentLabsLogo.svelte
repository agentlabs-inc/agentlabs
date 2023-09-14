<script lang="ts">
	import logoDark from "$lib/assets/img/logo-dark.svg";
	import logoLight from "$lib/assets/img/logo-light.svg";

	export let theme: "dark" | "light" = "dark";
</script>

<img alt="AgentLabs Logo" src={theme === "dark" ? logoDark : logoLight} class="w-32" />
