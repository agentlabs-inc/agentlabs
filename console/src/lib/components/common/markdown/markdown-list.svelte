<script lang="ts">
	import { MarkdownToken, type MarkdownOptions, type Renderers } from '@magidoc/plugin-svelte-marked';
	import type { Tokens } from 'marked'

	export let token: Tokens.List
	export let options: MarkdownOptions
	export let renderers: Renderers

	let component: 'ol' | 'ul'
	$: component = token.ordered ? 'ol' : 'ul'
</script>

<svelte:element this={component} start={token.start || 1} class="pl-3.5">
  {#each token.items as item}
    <MarkdownToken token={{ ...item }} {options} {renderers} />
  {/each}
</svelte:element>
