<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /** 徽标 */
  export interface BadgeAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 是否增加描边 */
    border?: boolean
    /** 徽标内容。boolean 显示小红点，number 显示数字，string 显示字符串 */
    content?: boolean | number | string
    /** 封顶数字值，content 为 number 时有效。默认值：99，0 表示不封顶 */
    max?: number
  }
</script>

<script lang="ts">
  let { border, content, max = 99, children, class: clazz, ...props }: BadgeAttributes = $props()

  let dotted = $derived(content === true ? 'sp-badge-dot' : '')
  let bordered = $derived(border ? 'sp-badge-border' : '')

  let display = $derived.by(() => {
    if (content === true) {
      return ''
    } else if (typeof content === 'number') {
      if (max > 0 && content > max) return `${max}+`
      else return content.toString()
    } else if (typeof content === 'string') {
      return content
    } else {
      return undefined
    }
  })
</script>

{#if children}
  <div class="sp-badge-wrapper {clazz}">
    {@render children?.()}
    <b class="sp-badge sp-badge-fixed {dotted} {bordered}">{display}</b>
  </div>
{:else}
  <div class="sp-badge {dotted} {bordered} {clazz}">{display}</div>
{/if}

<style type="postcss">
  .sp-badge-wrapper {
    @apply relative inline-block;
  }

  .sp-badge {
    @apply inline-block whitespace-nowrap rounded-full px-1 text-center font-normal text-white;
    background-color: var(--sp-color, #dc2626);
    font-size: 9px;
    line-height: 16px;
    min-width: 16px;
    z-index: 1;

    &.sp-badge-dot {
      @apply min-w-0;
      width: 10px;
      height: 10px;
      font-size: 0;
      line-height: 0;
    }

    &.sp-badge-fixed {
      @apply absolute -translate-y-1/2 translate-x-1/2;
      top: var(--sp-top, 0);
      right: var(--sp-right, 0);
    }

    &.sp-badge-border {
      box-shadow: 0 0 0 1px white;
    }
  }
</style>
