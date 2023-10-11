<script lang="ts">
import Markdown from '@magidoc/plugin-svelte-marked'
import MarkdownCode from './markdown-code.svelte';
import MarkdownParagraph from './markdown-paragraph.svelte';
import MarkdownHeading from './markdown-heading.svelte';
import MarkdownImage from './markdown-image.svelte';
import MarkdownLink from './markdown-link.svelte';
import MarkdownList from './markdown-list.svelte';
import MarkdownListItem from './markdown-list-item.svelte';

export let source: string;
</script>

<Markdown
	{source} 
	renderers={{
	code: MarkdownCode,
	paragraph: MarkdownParagraph,
	heading: MarkdownHeading,
	image: MarkdownImage,
	link: MarkdownLink,
	list: MarkdownList,
	list_item: MarkdownListItem,
	}}
/>
