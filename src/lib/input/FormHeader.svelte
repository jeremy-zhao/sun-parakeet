<script lang="ts">
  import './FormHeader.css'
  import type { HTMLAttributes } from 'svelte/elements'

  let { children, class: clazz, ...props }: HTMLAttributes<EventTarget> = $props()
</script>

<header class="sunp-form-header {clazz}" {...props}>
  {@render children?.()}
</header>
