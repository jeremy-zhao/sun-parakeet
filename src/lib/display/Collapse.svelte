<script lang="ts" module>
  import Button from '../common/Button.svelte'
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
  let transform = $derived(expanded ? 'none' : `translateY(-100%)`)

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
  <Button class="sp-collapse__header" color="text" shape="rectangular" onclick={onSwitch}>
    <h2>
      {#if typeof header === 'string'}
        {header}
      {:else}
        {@render header()}
      {/if}
    </h2>
  </Button>
  <div class="sp-collapse__content" style:height>
    <div use:onLoadContent class="sp-collapse__content-inner">
      {@render children?.()}
    </div>
  </div>
</div>

<style type="postcss">
  .sp-collapse {
    @apply w-full;
    --sp-border-color: #d1d5db;

    :global(.sp-collapse__header) {
      @apply w-full py-3;

      h2 {
        @apply flex-1 text-left;
      }
    }

    .sp-collapse__content {
      @apply relative ml-4 box-border overflow-hidden border-b transition-all duration-300;
      border-color: var(--sp-border-color);
      max-height: var(--sp-max-height, 'unset');

      &::before {
        @apply absolute left-0 right-0 top-0;
        content: '';
        height: 1px;
        background-color: var(--sp-border-color);
      }

      .sp-collapse__content-inner {
        @apply py-3 pr-4 text-sm opacity-0 transition-opacity duration-300;
      }
    }

    &.expanded {
      .sp-collapse__content {
        overflow: auto;

        .sp-collapse__content-inner {
          @apply opacity-100;
        }
      }
    }
  }
</style>
