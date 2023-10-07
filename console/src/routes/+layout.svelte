<script lang="ts">
	import type { LayoutData } from "./$types";
	import "../app.css";
	import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<SvelteToast />
<slot />
