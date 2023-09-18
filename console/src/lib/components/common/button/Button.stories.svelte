<script>
	import { Meta, Story } from "@storybook/addon-svelte-csf";
	import Button from "./Button.svelte";
	import { ArrowLeft, ArrowRight } from "svelte-hero-icons";
</script>

<Meta title="Common/Button" component={Button} />

<Story name="Basic">
	<Button>Primary button</Button>
</Story>

<div class="my-5" />

<Story name="Basic">
	<div><Button type="secondary">Secondary button</Button></div>
</Story>

<div class="my-5" />
<Story name="Basic">
	<Button center={false}>Not centered</Button>
</Story>

<div class="my-5" />
<Story name="Basic">
	<Button fullWidth={true}>Full width</Button>
</Story>

<div class="my-5" />
<Story name="Status">
	<Button>Normal</Button>
</Story>

<div class="my-5" />
<Story name="Status">
	<Button loading>Loading button</Button>
</Story>

<div class="my-5" />
<Story name="Status">
	<Button disabled>Disabled button</Button>
</Story>

<div class="my-5" />
<Story name="Icons">
	<Button leftIcon={ArrowLeft}>Left icon</Button>
</Story>

<div class="my-5" />
<Story name="Icons">
	<Button rightIcon={ArrowRight}>Left icon</Button>
</Story>

<div class="my-5" />
<Story name="Icons">
	<Button type="secondary" rightIcon={ArrowRight}>Left icon</Button>
</Story>
