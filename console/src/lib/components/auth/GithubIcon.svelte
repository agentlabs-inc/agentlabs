<script lang="ts">
	import IconLight from "$lib/assets/img/github-icon.svg";
	import IconDark from "$lib/assets/img/github-dark-icon.svg";
	import { themeStore } from "$lib/stores/theme";
</script>

{#if $themeStore === "dark"}
	<img src={IconLight} alt={"github"} class="w-5" />
{:else}
	<img src={IconDark} alt={"github"} class="w-5" />
{/if}
