<script lang="ts" module>
  import './Divider.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface DividerAttributes extends HTMLAttributes<EventTarget> {
    /** 内容位置，仅在 direction 为 'horizontal' 时有效。*/
    contentPosition?: 'center' | 'left' | 'right'
    /** 水平还是垂直类型 */
    direction?: 'horizontal' | 'vertical'
  }
</script>

<script lang="ts">
  let {
    contentPosition = 'center',
    direction = 'horizontal',
    children,
    class: clazz,
    ...props
  }: DividerAttributes = $props()
</script>

{#if direction === 'horizontal'}
  <div
    class="sunp-divider sunp-divider-horizontal sunp-divider-{contentPosition} {clazz}"
    {...props}
  >
    {@render children?.()}
  </div>
{:else if direction === 'vertical'}
  <span class="sunp-divider sunp-divider-vertical {clazz}"></span>
{/if}
