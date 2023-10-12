<script lang="ts">
	import "../app.css";
	import { SvelteToast } from "@zerodevx/svelte-toast";

	import { env } from "$env/dynamic/public";
	import { validateEnv } from "$lib/utils/validateEnv";

	validateEnv(env);
</script>

<SvelteToast />
<slot />
