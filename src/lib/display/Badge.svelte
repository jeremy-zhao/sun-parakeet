<script lang="ts" module>
  import './Badge.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 徽标 */
  export interface BadgeAttributes extends HTMLAttributes<EventTarget> {
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

  let dotted = $derived(content === true ? 'sun-parakeet-badge-dot' : '')
  let bordered = $derived(border ? 'sun-parakeet-badge-border' : '')

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
  <div class="sun-parakeet-badge-wrapper {clazz}" {...props}>
    {@render children?.()}
    <b class="sun-parakeet-badge sun-parakeet-badge-fixed {dotted} {bordered}">{display}</b>
  </div>
{:else}
  <div class="sun-parakeet-badge {dotted} {bordered} {clazz}" {...props}>{display}</div>
{/if}
