<script lang="ts">
import Highlight from 'svelte-highlight';
import { typescript } from 'svelte-highlight/languages';
import theme from "svelte-highlight/styles/vs2015.css";

export let token: any

</script>

<svelte:head>
{@html theme}
</svelte:head>

<Highlight language={typescript} code={token.text} class="rounded-lg text-sm rounded-sm" />
