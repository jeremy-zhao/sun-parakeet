<script lang="ts" module>
  import './Page.css'

  import { onNavigate } from '$app/navigation'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 页面 */
  export interface PageAttributes extends HTMLAttributes<EventTarget> {
    /** 页面飞入飞出的时间 */
    duration?: number
    /** 页面元素 */
    readonly page?: HTMLElement
  }

  let direction: 'load' | 'forward' | 'backward' = 'load'
</script>

<script lang="ts">
  import { fly } from 'svelte/transition'
  import type { TransitionConfig } from 'svelte/transition'

  let {
    page = $bindable<HTMLElement>(),
    duration = 150,
    children,
    class: clazz,
    ...props
  }: PageAttributes = $props()

  onNavigate(cb => {
    const delta = cb.delta ?? (cb.type === 'goto' ? 1 : cb.type === 'popstate' ? -1 : 0)
    direction = delta > 0 ? 'forward' : delta < 0 ? 'backward' : 'load'
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

<main bind:this={page} class="sunp-page {clazz}" {...props} in:flyIn out:flyOut>
  {@render children?.()}
</main>
