<script lang="ts">
	import Card from "$lib/components/common/card/Card.svelte";
	import Typography from "$lib/components/common/typography/Typography.svelte";
	import EmptyList from "$lib/assets/img/illustrations/empty-list.svg";

	export let title: string;
	export let description: string;
</script>

<div class="w-full">
	<Card>
		<div class="flex flex-col items-center justify-center gap-10 py-10 px-10">
			<img src={EmptyList} alt="not found" />
			<div class="text-center">
				<Typography type="sectionTitle">{title}</Typography>
				<Typography type="subTitle">{description}</Typography>
			</div>
			<slot />
		</div>
	</Card>
</div>
