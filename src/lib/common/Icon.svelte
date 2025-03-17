<script lang="ts" module>
  import type { SVGAttributes } from 'svelte/elements'

  /** 图标配置 */
  export interface IconOption {
    /** Svg 文件路径。默认值为 `/icons/symbol.svg` */
    path?: string
    /** 图标名称 */
    name: string
    /** 尺寸。默认值为 24 */
    size?: number
    /** CSS 类 */
    class?: string
    /** CSS 样式 */
    style?: string
    /** 顶部偏移量 */
    top?: number
  }

  export type IconAttributes = IconOption & SVGAttributes<SVGElement>
</script>

<script lang="ts">
  let { path = '/icons/symbol.svg', name, size = 24, top = 0, class: clazz, ...props }: IconAttributes = $props()
</script>

<svg class="sun-parakeet-icon {clazz}" style:top="{top}px" width={size} height={size} {...props}>
  <use href="{path}#{name}" />
</svg>

<style lang="postcss">
  .sun-parakeet-icon {
    @apply relative inline-block;
  }
</style>
