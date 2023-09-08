<script>
	import { Meta, Story } from "@storybook/addon-svelte-csf";
	import Card from "./Card.svelte";
	import CardBody from "./CardBody.svelte";
</script>

<Meta title="Common/Card" component={Card} />

<Story name="Basic">
	<Card>
		<CardBody>>My content</CardBody>
	</Card>
</Story>
