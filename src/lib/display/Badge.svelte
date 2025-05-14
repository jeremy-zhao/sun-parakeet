<script lang="ts" module>
  import './Badge.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 徽标 */
  export interface BadgeAttributes extends HTMLAttributes<EventTarget> {
    /** 徽标内容。boolean 显示小红点，number 显示数字，string 显示字符串 */
    content?: boolean | number | string
    /** 封顶数字值，content 为 number 时有效。默认值：99，0 表示不封顶 */
    max?: number
    /** 是否增加描边 */
    border?: boolean
  }
</script>

<script lang="ts">
  let { border, content, max = 99, children, class: clazz, ...props }: BadgeAttributes = $props()

  let dotted = $derived(content === true ? 'sunp-badge-dot' : '')
  let bordered = $derived(border ? 'sunp-badge-border' : '')

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
  <div class="sunp-badge-wrapper {clazz}" {...props}>
    {@render children?.()}
    <b class="sunp-badge sunp-badge-fixed {dotted} {bordered}">{display}</b>
  </div>
{:else}
  <b class="sunp-badge {dotted} {bordered} {clazz}" {...props}>{display}</b>
{/if}
