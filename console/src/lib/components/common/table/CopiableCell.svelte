<script lang="ts">
	import CopiableTag from "$lib/components/common/copiable/CopiableTag.svelte";

	export let cellValue: string;
</script>

<div class="max-w-[160px]">
	<CopiableTag value={cellValue} />
</div>
