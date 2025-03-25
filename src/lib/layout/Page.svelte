<script lang="ts" module>
  import './Page.css'

  import type { ClassValue, HTMLAttributes } from 'svelte/elements'

  /** 页面 */
  export interface PageAttributes extends HTMLAttributes<EventTarget> {
    class?: ClassValue
  }

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
