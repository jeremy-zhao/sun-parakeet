<script lang="ts" module>
  import './Step.css'

  import { getContext, onMount, type Snippet } from 'svelte'
  import { type HTMLLiAttributes } from 'svelte/elements'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import { type StepsContext } from './Steps.svelte'

  /** 步骤状态 */
  export type StepStatus =
    /** 未开始 */
    | 'wait'
    /** 进行中 */
    | 'process'
    /** 完成 */
    | 'finish'
    /** 失败 */
    | 'error'
    /** 跳过 */
    | 'skip'

  /** 步骤属性 */
  export interface StepAttributes extends HTMLLiAttributes {
    /** 标题 */
    header?: string | Snippet
    /** 步骤图标渲染函数 */
    icon?: string | IconOption | ((status: StepStatus) => string | IconOption | undefined)
    /** 指定状态。通常只需要指定 'errer' 和 'skip' 状态 */
    status?: StepStatus
  }
</script>

<script lang="ts">
  let { header, icon, status, children, class: clazz, ...props }: StepAttributes = $props()

  let steps = getContext<StepsContext>('sun_parakeet_steps')

  let _self: HTMLLIElement
  let _index = $state<number>(NaN)

  let _status = $derived.by<StepStatus>(() => {
    if (status) return status
    if (!steps || isNaN(_index)) return 'wait'

    const { value } = steps
    return value < _index ? 'wait' : value > _index ? 'finish' : 'process'
  })

  let _icon = $derived.by<IconOption | undefined>(() => {
    if (!icon) return undefined

    let ico = typeof icon === 'function' ? icon?.(_status) : icon

    if (typeof ico === 'string' && ico.length) {
      ico = { name: ico }
    }

    return ico as IconOption | undefined
  })

  onMount(() => {
    const observer = new MutationObserver(cb => {
      const changed = cb.find(x => x.type === 'attributes' && x.attributeName === 'data-step-index')
      if (!changed) return
      _index = parseInt(_self.dataset.stepIndex ?? '0')
    })

    observer.observe(_self, { attributes: true, attributeFilter: ['data-step-index'] })

    return { destroy: () => observer.disconnect() }
  })
</script>

<li bind:this={_self} class="sunp-step sunp-step-{_status} {clazz}" {...props}>
  <div class="sunp-step__indicator">
    <div class="sunp-step__handle">
      <div class="sunp-step__point">
        {#if _icon}
          {@const { size = 16, ...iconProps } = _icon}
          <Icon class="sunp-step__icon" {size} {...iconProps} />
        {/if}
      </div>
    </div>
  </div>
  <div class="sunp-step__content">
    {#if typeof header === 'string'}
      <header class="sunp-step__header">{header}</header>
    {:else if typeof header === 'function'}
      <header class="sunp-step__header">{@render header()}</header>
    {/if}
    {@render children?.()}
  </div>
</li>
