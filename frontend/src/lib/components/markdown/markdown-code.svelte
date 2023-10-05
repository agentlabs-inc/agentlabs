<script lang="ts">
import Highlight from 'svelte-highlight';
import { python, typescript } from 'svelte-highlight/languages';
import atomOneDark from 'svelte-highlight/styles/atom-one-dark';

export let token: any

const languages: Record<string, Highlight['language']> = {
	'typescript': typescript,
	'javascript': typescript,
	'python': python,
}

const language = languages[token.lang] || typescript

</script>

<svelte:head>
{@html atomOneDark}
</svelte:head>

<Highlight style={atomOneDark} language={language} code={token.text} class="antialiased rounded-lg text-sm rounded-sm" />
