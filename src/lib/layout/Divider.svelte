<script lang="ts" module>
  import './Divider.css'

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
        return 'sun-parakeet-divider-left'
      case 'right':
        return 'sun-parakeet-divider-right'
      default:
        return ''
    }
  })
</script>

{#if direction === 'horizontal'}
  <div class="sun-parakeet-divider-horizontal {position} {clazz}" {...props}>
    {#if children}
      <div class="sun-parakeet-divider-content">
        {@render children()}
      </div>
    {/if}
  </div>
{:else if direction === 'vertical'}
  <span class="sun-parakeet-divider-vertical {clazz}"></span>
{/if}
