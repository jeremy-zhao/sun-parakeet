<script lang="ts">
  console.debug('[RUN]', '/+layout.svelte')
  import '$themes/app.css'

  let { children } = $props()
</script>

{@render children?.()}
