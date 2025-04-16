<script lang="ts" module>
  import './Page.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 页面 */
  export interface PageAttributes extends HTMLAttributes<EventTarget> {
    /** 页面飞入飞出的时间 */
    duration?: number
  }
</script>

<script lang="ts">
  import stack from '../common/historyStack.js'
  import { fly } from 'svelte/transition'
  import type { TransitionConfig } from 'svelte/transition'

  const { duration = 300, children, class: clazz, ...props }: PageAttributes = $props()

  function flyIn(node: Element): TransitionConfig {
    const ps = stack.pageSwitch()

    switch (ps) {
      case 'forward':
        return fly(node, { duration, x: '100%' })
      case 'backward':
        return fly(node, { duration, x: '-100%' })
      default:
        return fly(node, { duration, x: '0' })
    }
  }

  function flyOut(node: Element): TransitionConfig {
    const ps = stack.pageSwitch()

    switch (ps) {
      case 'forward':
        return fly(node, { duration, x: '-100%' })
      case 'backward':
        return fly(node, { duration, x: '100%' })
      default:
        return fly(node, { duration, x: '0' })
    }
  }
</script>

<main class="sunp-page {clazz}" {...props} in:flyIn out:flyOut>
  {@render children?.()}
</main>
