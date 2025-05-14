<script lang="ts" module>
  import { onMount, setContext } from 'svelte'
  import './Steps.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 步骤条属性 */
  export interface StepsAttributes extends HTMLAttributes<EventTarget> {
    /** 步骤条的方向。默认值 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 当前步骤的索引值 */
    value?: number
  }

  /** 步骤条上下文信息 */
  export interface StepsContext {
    value: number
  }
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    direction = 'horizontal',
    children,
    class: clazz,
    ...props
  }: StepsAttributes = $props()

  let context = $state<StepsContext>({ value })
  setContext('sun_parakeet_steps', context)

  $effect(() => {
    context.value = value
  })

  let _self: HTMLUListElement

  function setStepIndex() {
    const items = _self.querySelectorAll('li.sunp-step')

    for (let i = 0, len = items.length; i < len; i++) {
      const item = items[i] as HTMLElement
      item.dataset.stepIndex = i.toString()
    }
  }

  onMount(() => {
    setStepIndex()

    const observer = new MutationObserver(setStepIndex)
    observer.observe(_self, { childList: true, subtree: true })

    return () => observer.disconnect()
  })
</script>

<ul bind:this={_self} class="sunp-steps sunp-steps-{direction} {clazz}" {...props}>
  {@render children?.()}
</ul>
