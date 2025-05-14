<script lang="ts" module>
  import './Switch.css'

  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  /** 开关属性 */
  export interface SwitchAttributes extends HTMLAttributes<EventTarget> {
    /** 指定当前是否打开 */
    checked?: boolean
    /** 打开时的内容 */
    checkedText?: string | Snippet
    /** 关闭时的内容 */
    uncheckedText?: string | Snippet
    /** 是否禁用 */
    disabled?: boolean
    /** 变化时的回调函数 */
    onChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  let {
    checked = $bindable(),
    checkedText = '',
    uncheckedText = '',
    disabled,
    onChange,
    class: clazz,
    ...props
  }: SwitchAttributes = $props()

  function onClick() {
    if (disabled) return

    checked = !checked
    onChange?.(checked)
  }
</script>

<div
  class="sunp-switch {clazz}"
  class:sunp-switch-checked={checked}
  class:sunp-switch-disabled={disabled}
  role="switch"
  aria-label="开关"
  aria-checked={checked}
  aria-disabled={disabled}
  onclick={onClick}
  {...props}
>
  <div class="sunp-switch__checkbox">
    <div class="sunp-switch__handle"></div>
    <div class="sunp-switch__inner">
      {#if checked && typeof checkedText === 'string'}
        {checkedText}
      {:else if checked && typeof checkedText === 'function'}
        {@render checkedText()}
      {:else if !checked && typeof uncheckedText === 'string'}
        {uncheckedText}
      {:else if !checked && typeof uncheckedText === 'function'}
        {@render uncheckedText()}
      {/if}
    </div>
  </div>
</div>
