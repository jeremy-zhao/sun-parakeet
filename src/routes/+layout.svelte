<script lang="ts">
  console.debug('[RUN]', '/+layout.svelte')
  import '../app.css'

  import { Toast } from '$lib'

  let { children } = $props()
</script>

{@render children?.()}

<Toast />
