<script lang="ts" module>
  import './Textarea.css'

  import type { Snippet } from 'svelte'
  import type { HTMLTextareaAttributes } from 'svelte/elements'

  /** 文本域属性 */
  export interface TextareaAttributes extends HTMLTextareaAttributes {
    /** 输入值 */
    value?: string
    /** 显示行数 */
    rows?: number
    /** 自适应内容高度 */
    autosize?:
      | boolean
      | {
          /** 最小行数 */
          minRows?: number
          /** 最大行数 */
          maxRows?: number
        }

    /** 显示统计值 */
    statistic?: boolean | Snippet<[number, number | null | undefined]>
    /** 输入框内容变化时触发 */
    onChange?: (value: string) => void
    children?: undefined
  }
</script>

<script lang="ts">
  let {
    value = $bindable(''),
    rows = 2,
    autosize = false,
    statistic = false,
    maxlength,
    disabled,
    class: clazz,
    style,
    ...props
  }: TextareaAttributes = $props()

  let textarea: HTMLTextAreaElement
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

<div class="sunp-text-area" class:sunp-text-area-disabled={disabled}>
  <textarea
    bind:this={textarea}
    bind:value
    class="sunp-text-area__element {clazz}"
    rows={_rows}
    {maxlength}
    {style}
    {disabled}
    {...props}
    oninput={handleInput}
  ></textarea>
  {#if autosize}
    <textarea
      bind:this={clone}
      {value}
      class="sunp-text-area__element sunp-text-area__element-hidden {clazz}"
      {style}
      aria-hidden="true"
      readonly
    ></textarea>
  {/if}
  {#if statistic === true}
    <div class="sunp-text-area__statistic">
      {count}{#if maxlength}/{maxlength}{/if}
    </div>
  {:else if typeof statistic === 'function'}
    {@render statistic(count, maxlength)}
  {/if}
</div>
