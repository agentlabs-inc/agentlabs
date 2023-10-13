<script lang="ts">
  export let token: any
</script>

<a href={token.href} target="_blank" rel="noopener noreferrer">
	<img
	  src={token.href}
	  title={token.text}
	  alt={token.text}
	  class="max-w-full max-h-[300px]"
	/>
</a>
