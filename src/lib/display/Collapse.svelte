<script lang="ts" module>
  import './Collapse.css'
  import ArrowIcon from '../icons/arrow-down-s-line.svg?raw'

  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'

  /** 折叠面板 */
  export interface CollapseAttributes extends HTMLAttributes<EventTarget> {
    /** 展开状态 */
    expanded?: boolean
    /** 标题 */
    header: string | Snippet
    /** 展开状态改变 */
    onChange?: (expanded: boolean) => void
  }
</script>

<script lang="ts">
  let {
    expanded = $bindable(false),
    header,
    class: clazz,
    onChange,
    children,
    ...props
  }: CollapseAttributes = $props()

  let contentHeight = $state<number>()
  let height = $derived(!expanded ? '1px' : contentHeight ? `${contentHeight + 2}px` : 'auto')

  function onSwitch() {
    expanded = !expanded
    onChange?.(expanded)
  }

  function onLoadContent(node: HTMLDivElement) {
    const resize = new ResizeObserver(entries => {
      if (!entries?.length) return
      contentHeight = entries[0].borderBoxSize[0].blockSize
    })

    resize.observe(node)

    return {
      destroy() {
        resize.disconnect()
      },
    }
  }
</script>

<div class="sunp-collapse {clazz}" class:sunp-collapse-expanded={expanded} {...props}>
  <button class="sunp-collapse__header" onclick={onSwitch}>
    {#if typeof header === 'string'}
      <span class="sunp-collapse__header-text">{header}</span>
      <Icon class="sunp-collapse__header-icon" svg={ArrowIcon} size={32} />
    {:else}
      {@render header()}
    {/if}
  </button>
  <div class="sunp-collapse__container" style:height>
    <div use:onLoadContent class="sunp-collapse__content">
      {@render children?.()}
    </div>
  </div>
</div>
