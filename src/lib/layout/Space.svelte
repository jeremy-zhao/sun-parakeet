<script lang="ts" module>
  import './Space.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface SpaceAttributes extends HTMLAttributes<EventTarget> {
    /** 是否渲染为块级元素 */
    block?: boolean
    /** 排列方向。默认为 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 是否自动换行。仅在 'horizontal' 时有效 */
    wrap?: boolean
  }
</script>

<script lang="ts">
  let {
    block,
    direction = 'horizontal',
    wrap,
    children,
    class: clazz,
    ...props
  }: SpaceAttributes = $props()

  let _wrap = $derived(direction === 'horizontal' && wrap)
</script>

<div
  class="sunp-space sunp-space-{direction} {clazz}"
  class:sunp-space-wrap={_wrap}
  class:sunp-space-block={block}
  {...props}
>
  {@render children?.()}
</div>
