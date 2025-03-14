<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 列表 */
  export interface ListAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 标题 */
    header?: string | Snippet
  }
</script>

<script lang="ts">
  let { header, children, class: clazz, ...props }: ListAttributes = $props()
</script>

<div class="sp-list">
  {#if typeof header === 'string'}
    <header class="sp-list__header">
      {header}
    </header>
  {:else if typeof header === 'function'}
    <header class="sp-list__header">
      {@render header()}
    </header>
  {/if}

  {@render children?.()}
</div>

<style lang="postcss">
  .sp-list {
    @apply relative mt-[-1px] box-border border-t;
    --sp-border-color: #e5e7eb;
    border-color: var(--sp-border-color);

    &::after {
      @apply absolute bottom-0 left-0 right-0;
      content: '';
      height: 1px;
      background-color: var(--sp-border-color);
    }

    .sp-list__header {
      @apply relative border-y bg-gray-100 px-4 py-2 text-gray-500;
      border-top-color: transparent;
      border-bottom-color: var(--sp-border-color);
      font-size: 15px;
      z-index: 1;
    }
  }
</style>
