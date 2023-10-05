<script lang="ts">
import { urlUtils } from '@magidoc/plugin-svelte-marked'
import type {  MarkdownOptions } from '@magidoc/plugin-svelte-marked'

const depthToFontClasses: Record<number, string> = {
	1: 'text-2xl font-bold',
	2: 'text-xl font-bold',
	3: 'text-lg font-bold',
	4: 'text-base font-bold',
	5: 'text-sm font-bold',
	6: 'text-xs font-bold'
}

const depthToSpacingClasses: Record<number, string> = {
	1: 'my-6',
	2: 'my-5',
	3: 'my-4',
	4: 'my-3',
	5: 'my-2',
	6: 'my-1'
}

export let token: any
export let options: MarkdownOptions

let id: string | undefined
$: id = urlUtils.generatePathSegment(token.text, options.slugger)
</script>

<div 
	class={`flex items-center group my-6 ${depthToSpacingClasses[token.depth]}`}
>
	<svelte:element this={`h${token.depth}`} {id} class={`${depthToFontClasses[token.depth]}`}>
		<slot />
	</svelte:element>
	<!--
	<a href={`#${id}`} class="group-hover:visible invisible">
		<Icon src={Link} class="w-6 h-6 ml-4 text-primary" />
	</a>
	-->
</div>
