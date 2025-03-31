<script lang="ts" module>
  import './Space.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface SpaceAttributes extends HTMLAttributes<EventTarget> {
    /** 交叉轴对齐方式 */
    align?: 'start' | 'end' | 'center' | 'baseline'
    /** 是否渲染为块级元素 */
    block?: boolean
    /** 间距方向。默认为 'horizontal' */
    direction?: 'vertical' | 'horizontal'
    /** 主轴对齐方式 */
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'
    /** 是否自动换行。仅在 'horizontal' 时有效 */
    wrap?: boolean
  }
</script>

<script lang="ts">
  let {
    align,
    block,
    direction = 'horizontal',
    justify,
    wrap,
    class: clazz,
    children,
    ...props
  }: SpaceAttributes = $props()

  let _wrap = $derived(direction === 'horizontal' && wrap)

  let _justify = $derived.by(() => {
    switch (justify) {
      case 'start':
      case 'end':
        return `flex-${justify}`
      case 'between':
      case 'around':
      case 'evenly':
        return `space-${justify}`
      case 'center':
      case 'stretch':
        return justify
    }
  })

  let _align = $derived.by(() => {
    switch (align) {
      case 'start':
      case 'end':
        return `flex-${align}`
      case 'center':
      case 'baseline':
        return align
    }
  })
</script>

<div
  class="sun-parakeet-space sun-parakeet-space-{direction} {clazz}"
  class:sun-parakeet-space-wrap={_wrap}
  class:sun-parakeet-space-block={block}
  style:justify-content={_justify}
  style:align-items={_align}
  {...props}
>
  {@render children?.()}
</div>
