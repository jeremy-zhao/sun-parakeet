<script lang="ts" module>
  import './Page.css'

  import { beforeNavigate, afterNavigate, onNavigate } from '$app/navigation'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 页面 */
  export interface PageAttributes extends HTMLAttributes<EventTarget> {
    /** 页面飞入飞出的时间 */
    duration?: number
  }

  let direction: 'load' | 'forward' | 'backward' = 'load'
</script>

<script lang="ts">
  import { fly } from 'svelte/transition'
  import type { TransitionConfig } from 'svelte/transition'

  const { duration = 300, children, class: clazz, ...props }: PageAttributes = $props()

  onNavigate(cb => {
    const delta = cb.delta ?? (cb.type === 'goto' ? 1 : cb.type === 'popstate' ? -1 : 0)
    direction = delta > 0 ? 'forward' : delta < 0 ? 'backward' : 'load'
    console.log('onNavigate', delta, direction)
  })

  function flyIn(node: Element): TransitionConfig {
    switch (direction) {
      case 'forward':
        return fly(node, { duration, x: '100%' })
      case 'backward':
        return fly(node, { duration, x: '-100%' })
      default:
        return fly(node, { duration, x: '0' })
    }
  }

  function flyOut(node: Element): TransitionConfig {
    switch (direction) {
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
