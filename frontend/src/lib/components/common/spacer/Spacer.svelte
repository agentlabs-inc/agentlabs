<script lang="ts">
	type Size = "xs" | "sm" | "md" | "lg";
	export let size: Size = "sm";

	export const sizeClassMap: Record<Size, string> = {
		xs: "my-2",
		sm: "my-5",
		md: "my-10",
		lg: "my-20"
	};
</script>

<div class={sizeClassMap[size]} />
