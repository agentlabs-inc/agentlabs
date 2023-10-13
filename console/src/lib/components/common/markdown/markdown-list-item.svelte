<script lang="ts">
  import type { MarkdownOptions, Renderers } from '@magidoc/plugin-svelte-marked'

  import type { Tokens } from 'marked'

  export const token: Tokens.ListItem | undefined = undefined
  export const options: MarkdownOptions | undefined = undefined
  export const renderers: Renderers | undefined = undefined
</script>

<li class="pl-1 list-disc"><slot /></li>
