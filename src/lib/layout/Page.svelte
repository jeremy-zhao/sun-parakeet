<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /** 页面 */
  export interface PageAttributes extends HTMLAttributes<HTMLElement> {}

  const duration = 300
</script>

<script lang="ts">
  import stack from '../common/historyStack.js'
  import { fly } from 'svelte/transition'
  import type { TransitionConfig } from 'svelte/transition'

  const { class: clazz, children, ...props }: PageAttributes = $props()

  function flyIn(node: Element): TransitionConfig {
    const ps = stack.pageSwitch()
    return ps === 'forward' ? fly(node, { duration, x: '100%' }) : fly(node, { duration, x: '-100%' })
  }

  function flyOut(node: Element): TransitionConfig {
    const ps = stack.pageSwitch()
    return ps === 'forward' ? fly(node, { duration, x: '-100%' }) : fly(node, { duration, x: '100%' })
  }
</script>

<main class="sun-parakeet-page {clazz}" {...props} in:flyIn out:flyOut>
  {@render children?.()}
</main>

<style lang="postcss">
  .sun-parakeet-page {
    @apply fixed top-0 right-0 bottom-0 left-0 overflow-x-hidden overflow-y-auto;
  }
</style>
