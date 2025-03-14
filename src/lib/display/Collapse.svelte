<script lang="ts" module>
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
    class: 'sp-collapse__header-icon',
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

<div class="sp-collapse {clazz}" class:expanded {...props}>
  <ListItem class="sp-collapse__header" clickable={true} onclick={onSwitch} {icon}>
    <div class="sp-collapse__header-left">
      {#if typeof header === 'string'}
        {header}
      {:else}
        {@render header()}
      {/if}
    </div>
  </ListItem>
  <div class="sp-collapse__content" style:height>
    <div use:onLoadContent class="sp-collapse__content-inner">
      {@render children?.()}
    </div>
  </div>
</div>

<style type="postcss">
  .sp-collapse {
    @apply relative w-full bg-white;
    --sp-border-color: #e5e7eb;

    :global(.sp-collapse__header-icon) {
      @apply text-gray-400 transition-transform duration-300;
    }

    .sp-collapse__content {
      @apply relative ml-4 mt-[-1px] box-border overflow-hidden border-b transition-all duration-300;
      border-color: var(--sp-border-color);
      max-height: var(--sp-max-height, 'unset');

      .sp-collapse__content-inner {
        @apply py-3 pr-4 text-sm opacity-0 transition-opacity duration-300;
      }
    }

    &.expanded {
      :global(.sp-collapse__header-icon) {
        @apply -rotate-180;
      }

      .sp-collapse__content {
        overflow: auto;

        .sp-collapse__content-inner {
          @apply opacity-100;
        }
      }
    }
  }
</style>
