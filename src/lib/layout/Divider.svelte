<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface DividerAttributes extends HTMLAttributes<HTMLElement> {
    /** 内容位置，仅在 direction 为 'horizontal' 时有效。*/
    contentPosition?: 'center' | 'left' | 'right'
    /** 水平还是垂直类型 */
    direction?: 'horizontal' | 'vertical'
  }
</script>

<script lang="ts">
  let {
    direction = 'horizontal',
    contentPosition = 'center',
    class: clazz,
    children,
    ...props
  }: DividerAttributes = $props()

  let position = $derived.by(() => {
    switch (contentPosition) {
      case 'left':
        return 'sp-divider-left'
      case 'right':
        return 'sp-divider-right'
      default:
        return ''
    }
  })
</script>

{#if direction === 'horizontal'}
  <div class="sp-divider-horizontal {position} {clazz}" {...props}>
    {#if children}
      <div class="sp-divider-content">
        {@render children()}
      </div>
    {/if}
  </div>
{:else if direction === 'vertical'}
  <span class="sp-divider-vertical {clazz}"></span>
{/if}

<style lang="postcss">
  .sp-divider-horizontal {
    @apply flex items-center text-sm text-gray-500;
    --sp-border-color: #e5e7eb;
    border-color: var(--sp-border-color);

    &::before,
    &::after {
      @apply flex-auto border-t;
      border-style: inherit;
      border-color: inherit;
      content: '';
    }

    &.sp-divider-left::before {
      max-width: 10%;
    }

    &.sp-divider-right::after {
      max-width: 10%;
    }

    .sp-divider-content {
      @apply mx-4;
    }
  }

  .sp-divider-vertical {
    @apply relative mx-4 inline-block border-l;
    --sp-border-color: #e5e7eb;
    height: 0.9em;
    border-color: var(--sp-border-color);
    top: 0.1em;
  }
</style>
