<script lang="ts">
  console.debug('[RUN]', '/+layout.svelte')
  import '../app.css'

  let { children } = $props()
</script>

{@render children?.()}
