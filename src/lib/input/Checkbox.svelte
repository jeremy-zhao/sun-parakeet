<script lang="ts" module>
  import './Checkbox.css'
  import CheckIcon from '../icons/check.svg?raw'

  import { getContext, onMount } from 'svelte'
  import { isNonEmpty } from '../common'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { CheckboxGroupContext } from './CheckboxGroup.svelte'

  /** 单选框属性 */
  export interface CheckboxAttributes extends HTMLInputAttributes {
    /** 自定义图标 */
    icon?: string | IconOption
    /** 自定义中间状态图标 */
    iconIndeterminate?: string | IconOption
    /** 值。作为 CheckboxGroup 成员时必须提供 */
    value?: PropertyKey
    /**  */
    onChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  let group = getContext<CheckboxGroupContext>('sun_parakeet_checkbox_group')

  let {
    checked = $bindable(false),
    value,
    indeterminate = false,
    icon,
    class: clazz,
    style,
    children,
    onChange,
    ...props
  }: CheckboxAttributes = $props()

  let input: HTMLInputElement

  let size = $derived(typeof icon === 'object' && icon.size ? icon.size : 22)

  function handleChange() {
    onChange?.(!!checked)
    group?.onChange()
  }

  function handleCheck() {
    checked = !checked
  }

  onMount(() => {
    if (group && !isNonEmpty(value)) {
      console.warn('[CheckboxGroup]', 'Checkbox 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略', value)
      return
    }

    group?.register(value!, input, handleCheck)

    return () => {
      group?.unregister(value!)
    }
  })
</script>

<label class="sun-parakeet-checkbox {clazz}" class:sun-parakeet-checkbox-checked={checked} {style}>
  <input
    bind:this={input}
    bind:checked
    class="sun-parakeet-checkbox-element"
    type="checkbox"
    {...props}
    onchange={handleChange}
  />
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
