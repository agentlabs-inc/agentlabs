<script lang="ts">
	type Size = "sm" | "md";
	export let size: Size = "sm";

	export const sizeClassMap: Record<Size, string> = {
		sm: "my-5",
		md: "my-10"
	};
</script>

<div class={sizeClassMap[size]} />
