<script lang="ts" module>
  import './Switch.css'

  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'

  export interface SwitchAttributes extends HTMLAttributes<EventTarget> {
    /** 指定当前是否打开 */
    checked?: boolean
    /** 选中时的内容 */
    checkedText?: string | Snippet
    /** 禁用状态 */
    disabled?: boolean
    /** 变化时的回调函数 */
    onChange?: (checked: boolean) => void
    /** 非选中时的内容 */
    uncheckedText?: string | Snippet
  }
</script>

<script lang="ts">
  let {
    checked = $bindable(),
    checkedText = '',
    uncheckedText = '',
    disabled,
    onChange,
    ...props
  }: SwitchAttributes = $props()

  function onClick() {
    if (disabled) return

    checked = !checked
    onChange?.(checked)
  }
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="sun-parakeet-switch"
  class:sun-parakeet-switch-checked={checked}
  class:sun-parakeet-switch-disabled={disabled}
  role="switch"
  aria-label="开关"
  aria-checked={checked}
  aria-disabled={disabled}
  onclick={onClick}
  {...props}
>
  <div class="sun-parakeet-switch-checkbox">
    <div class="sun-parakeet-switch__handle"></div>
    <div class="sun-parakeet-switch__inner">
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
