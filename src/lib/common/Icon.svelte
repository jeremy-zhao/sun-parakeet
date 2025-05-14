<script lang="ts" module>
  import './Icon.css'

  import type { SVGAttributes } from 'svelte/elements'

  /** 图标配置 */
  export interface IconOption {
    /** Svg 文件路径。默认值为 `/icons/symbol.svg` */
    path?: string
    /** 图标名称 */
    name?: string
    /** Svg 编码。请通过 import IconCode from '../path/to/file.svg?raw' 引入。 */
    svg?: string
    /** 尺寸。默认值为 24 */
    size?: number
    /** CSS 类 */
    class?: string
    /** CSS 样式 */
    style?: string
    /** 顶部偏移量 */
    top?: number
  }

  /** 图标 */
  export type IconAttributes = IconOption & SVGAttributes<SVGElement>

  /** SVG 正则判定 */
  export const svgRegex = /<svg[^>]*>[^]*<\/svg>/
</script>

<script lang="ts">
  let {
    path = '/icons/symbol.svg',
    name = '',
    svg,
    size = 24,
    top = 0,
    class: clazz,
    ...props
  }: IconAttributes = $props()

  let isSvg = $derived(svg && svgRegex.test(svg))
</script>

<svg class="sunp-icon {clazz}" style:top="{top}px" width={size} height={size} {...props}>
  {#if isSvg}
    {@html svg}
  {:else}
    <use href="{path}#{name}" />
  {/if}
</svg>
