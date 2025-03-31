<script lang="ts" module>
  import './Checkbox.css'
  import CheckIcon from '../icons/check.svg?raw'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  /** 单选框属性 */
  export interface CheckboxAttributes extends HTMLInputAttributes {
    /** 自定义图标 */
    icon?: string | IconOption
    /** 自定义中间状态图标 */
    iconIndeterminate?: string | IconOption
    /**  */
    onChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  let {
    checked = $bindable(false),
    indeterminate = false,
    icon,
    class: clazz,
    style,
    children,
    ...props
  }: CheckboxAttributes = $props()

  let size = $derived(typeof icon === 'object' && icon.size ? icon.size : 22)
</script>

<label class="sun-parakeet-checkbox {clazz}" class:sun-parakeet-checkbox-checked={checked} {style}>
  <input bind:checked class="sun-parakeet-checkbox-element" type="checkbox" {...props} />
  <div class="sun-parakeet-checkbox__icon" style:width="{size}px" style:height="{size}px">
    {#if checked}
      <Icon svg={CheckIcon} size={16} />
    {:else if indeterminate}
      <Icon svg={CheckIcon} size={17} />
    {/if}
  </div>
  {#if children}
    <div class="sun-parakeet-checkbox__content">{@render children()}</div>
  {/if}
</label>
