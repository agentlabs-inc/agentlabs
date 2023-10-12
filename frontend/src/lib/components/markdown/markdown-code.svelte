<script lang="ts">
import Highlight from 'svelte-highlight';
import { python, shell, typescript } from 'svelte-highlight/languages';
import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
import { Icon, ClipboardDocument } from 'svelte-hero-icons';

export let token: any

const languages: Record<string, Highlight['language']> = {
	'typescript': typescript,
	'javascript': typescript,
	'python': python,
	'shell': shell,
}

const language = languages[token.lang] || typescript

const handleCopy = () => {
	navigator.clipboard?.writeText(token.text)
}

</script>

<svelte:head>
{@html atomOneDark}
</svelte:head>

<div
	class="antialiased rounded-lg text-sm rounded-md shadow-sm overflow-hidden relative"
>
	<div class="absolute top-0 right-0 p-2 flex items-center gap-x-2">
		<span class="text-xs text-body-base dark:text-body-base">{token.lang}</span>
		<button on:click={handleCopy} class="hover:opacity-80 active:opacity-50">
			<Icon src={ClipboardDocument} class="w-5 h-5 text-body-base dark:text-body-base" />
		</button>
	</div>
	<Highlight style={atomOneDark} language={language} code={token.text}  />
</div>
