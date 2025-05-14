<script lang="ts" module>
  import './AutoCenter.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface AutoCenterAttributes extends HTMLAttributes<EventTarget> {}
</script>

<script lang="ts">
  let { children, class: clazz, ...props }: AutoCenterAttributes = $props()
</script>

<div class="sunp-auto-center {clazz}" {...props}>
  <div class="sunp-auto-center__content">
    {@render children?.()}
  </div>
</div>
