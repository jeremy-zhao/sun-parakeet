<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface AutoCenterAttributes extends HTMLAttributes<HTMLElement> {}
</script>

<script lang="ts">
  let { class: clazz, children, ...props }: AutoCenterAttributes = $props()
</script>

<div class="sp-auto-center {clazz}" {...props}>
  <div class="sp-auto-center__inner">
    {@render children?.()}
  </div>
</div>

<style lang="postcss">
  .sp-auto-center {
    @apply flex items-center justify-center;
  }
</style>
