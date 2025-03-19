<script lang="ts" module>
  import './Collapse.css'

  import ListItem from './ListItem.svelte'
  import type { IconOption } from '../common/Icon.svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 折叠面板 */
  export interface CollapseAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 展开状态 */
    expanded?: boolean
    /** 标题 */
    header: string | Snippet
    /** 展开状态改变 */
    onChange?: (expanded: boolean) => void
  }
</script>

<script lang="ts">
  let { expanded = $bindable(false), header, class: clazz, onChange, children, ...props }: CollapseAttributes = $props()

  let contentHeight = $state(1)
  let height = $derived(expanded ? `${contentHeight + 2}px` : '1px')

  const icon: IconOption = {
    name: 'arrow-down-s-line',
    size: 30,
    class: 'sun-parakeet-collapse__header-icon',
  }

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

<div class="sun-parakeet-collapse {clazz}" class:expanded {...props}>
  <ListItem class="sun-parakeet-collapse__header" clickable={true} onclick={onSwitch} {icon}>
    <div class="sun-parakeet-collapse__header-left">
      {#if typeof header === 'string'}
        {header}
      {:else}
        {@render header()}
      {/if}
    </div>
  </ListItem>
  <div class="sun-parakeet-collapse__content" style:height>
    <div use:onLoadContent class="sun-parakeet-collapse__content-inner">
      {@render children?.()}
    </div>
  </div>
</div>
