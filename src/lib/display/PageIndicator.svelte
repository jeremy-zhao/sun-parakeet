<script lang="ts" module>
  import './PageIndicator.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface PageIndicatorAttributes extends HTMLAttributes<EventTarget> {
    /** 方向。默认值 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 当前页 (从 0 开始计数) */
    value?: number
    /** 总页数 */
    total?: number
  }
</script>

<script lang="ts">
  let {
    value = 0,
    direction = 'horizontal',
    total = 0,
    class: clazz,
    ...props
  }: PageIndicatorAttributes = $props()

  let dots = $derived(new Array(total))
</script>

<ul class="sunp-page-indicator sunp-page-indicator-{direction} {clazz}" {...props}>
  {#each dots, index}
    <li class="sunp-page-indicator-dot" class:sunp-page-indicator-dot-active={value === index}></li>
  {/each}
</ul>
