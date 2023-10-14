<script lang="ts">
	import Button from "$lib/components/common/button/Button.svelte";

	export let cellValue: {
		label: string;
		onClick: () => void;
		type: "primary" | "secondary" | "danger";
	};
</script>

<div class="max-w-[160px]">
	<Button on:click={cellValue.onClick} type={cellValue.type}>{cellValue.label}</Button>
</div>
