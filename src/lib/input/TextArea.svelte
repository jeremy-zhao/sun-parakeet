<script lang="ts" module>
  import './Textarea.css'

  import type { Snippet } from 'svelte'
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  /** 文本域属性 */
  export interface TextareaAttributes extends HTMLTextareaAttributes {
    /** 自适应内容高度 */
    autosize?:
      | boolean
      | {
          /** 最小行数 */
          minRows?: number
          /** 最大行数 */
          maxRows?: number
        }
    /** 行数 */
    rows?: number
    /** 显示统计值 */
    statistic?: boolean | Snippet<[number, number]>
    /** 输入值 */
    value?: string
    /** 输入框内容变化时触发 */
    onChange?: (value: string) => void
    // 屏蔽
    children?: undefined
  }
</script>

<script lang="ts">
  let { value = $bindable(''), autosize, rows = 2, class: clazz, ...props }: TextareaAttributes = $props()

  let _rows = $derived.by(() => {})
</script>

<div class="sun-parakeet-text-area">
  <textarea class="sun-parakeet-text-area-element {clazz}" {rows} {...props}>{value}</textarea>
  <div class="sun-parakeet-text-area__statistic"></div>
</div>
