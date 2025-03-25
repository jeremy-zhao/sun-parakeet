<script lang="ts" module>
  import './AutoCenter.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface AutoCenterAttributes extends HTMLAttributes<EventTarget> {}
</script>

<script lang="ts">
  let { class: clazz, children, ...props }: AutoCenterAttributes = $props()
</script>

<div class="sun-parakeet-auto-center {clazz}" {...props}>
  <div>
    {@render children?.()}
  </div>
</div>
