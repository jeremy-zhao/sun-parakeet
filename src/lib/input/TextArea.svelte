<script lang="ts" module>
  import './Textarea.css'

  import { onMount, type Snippet } from 'svelte'
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
  let {
    value = $bindable(''),
    autosize = false,
    rows = 2,
    statistic = false,
    maxlength,
    class: clazz,
    style,
    ...props
  }: TextareaAttributes = $props()

  let clone = $state<HTMLTextAreaElement>()
  let _rows = $state(typeof autosize === 'object' && autosize.minRows ? autosize.minRows : rows)

  let count = $derived(value.length)

  function getLineCount(textarea: HTMLTextAreaElement) {
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20
    return Math.round(textarea.scrollHeight / lineHeight)
  }

  function handleInput() {
    if (!clone || !autosize) return

    const lines = getLineCount(clone)

    if (typeof autosize === 'boolean') {
      _rows = Math.max(rows, lines)
    } else if (typeof autosize === 'object') {
      const { minRows = rows, maxRows } = autosize
      _rows = lines < minRows ? minRows : maxRows && lines > maxRows ? maxRows : lines
    }
  }
</script>

<div class="sun-parakeet-text-area">
  <textarea bind:value class="sun-parakeet-text-area-element {clazz}" rows={_rows} {...props} oninput={handleInput}
  ></textarea>
  {#if autosize}
    <textarea
      bind:this={clone}
      {value}
      class="sun-parakeet-text-area-element sun-parakeet-text-area-element-hidden {clazz}"
      {style}
      aria-hidden="true"
      readonly
    ></textarea>
  {/if}
  {#if statistic}
    <div class="sun-parakeet-text-area__statistic">
      {count}
      {#if maxlength}
        / {maxlength}
      {/if}
    </div>
  {/if}
</div>
