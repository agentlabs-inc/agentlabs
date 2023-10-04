<script lang="ts">
  import { urlUtils } from '@magidoc/plugin-svelte-marked'
  import type { MarkdownOptions } from '@magidoc/plugin-svelte-marked'

  export let token: any;
  export let options: MarkdownOptions
</script>

<a
class="underline hover:opacity-80"
target={'_blank'}
rel={'noopener noreferrer'}
  href={urlUtils.isRelative(token.href)
    ? urlUtils.joinUrlPaths(options.baseUrl, token.href)
    : token.href}
  title={token.title}
>
  <slot />
</a>
