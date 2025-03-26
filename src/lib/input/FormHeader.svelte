<script lang="ts">
  import './FormHeader.css'
  import type { HTMLAttributes } from 'svelte/elements'

  let { children, ...props }: HTMLAttributes<EventTarget> = $props()
</script>

<header class="sun-parakeet-form-header" {...props}>{@render children?.()}</header>
