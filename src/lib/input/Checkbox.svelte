<script lang="ts" module>
  import './Checkbox.css'
  import CheckIcon from '../icons/check-line.svg?raw'
  import IndeterminateIcon from '../icons/subtract-line.svg?raw'

  import { getContext, onMount } from 'svelte'
  import { isNonEmpty } from '../common'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { CheckboxGroupContext } from './CheckboxGroup.svelte'

  /** 单选框属性 */
  export interface CheckboxAttributes extends HTMLInputAttributes {
    /** 值。作为 CheckboxGroup 成员时必须提供 */
    value?: PropertyKey
    /** 自定义图标 */
    icon?: string | IconOption
    /** 自定义中间状态图标 */
    iconIndeterminate?: string | IconOption
    /** 变更事件 */
    onChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  let group = getContext<CheckboxGroupContext>('sun_parakeet_checkbox_group')

  let {
    checked = $bindable(false),
    value,
    indeterminate = false,
    icon = { svg: CheckIcon, top: 1 },
    iconIndeterminate = { svg: IndeterminateIcon },
    disabled,
    class: clazz,
    style,
    children,
    onChange,
    ...props
  }: CheckboxAttributes = $props()

  let input: HTMLInputElement

  let size = $derived(typeof icon === 'object' && icon.size ? icon.size : 22)

  let sizeIndeterminate = $derived(
    typeof iconIndeterminate === 'object' && iconIndeterminate.size ? iconIndeterminate.size : 22
  )

  function handleChange() {
    onChange?.(!!checked)
    group?.onChange()
  }

  function handleCheck(chk: boolean) {
    checked = chk
  }

  onMount(() => {
    if (group && !isNonEmpty(value)) {
      console.warn(
        '[CheckboxGroup]',
        'Checkbox 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
        value
      )
      return
    }

    group?.register(value!, input, handleCheck)

    return () => {
      group?.unregister(value!)
    }
  })
</script>

<label
  class="sunp-checkbox {clazz}"
  class:sunp-checkbox-checked={checked && !indeterminate}
  class:sunp-checkbox-indeterminate={indeterminate}
  class:sunp-checkbox-disabled={disabled}
  {style}
>
  <input
    bind:this={input}
    bind:checked
    bind:indeterminate
    class="sunp-checkbox__input"
    type="checkbox"
    {value}
    {disabled}
    {...props}
    onchange={handleChange}
  />
  <div class="sunp-checkbox__icon" style:width="{size}px" style:height="{size}px">
    {#if indeterminate}
      {#if typeof iconIndeterminate === 'string'}
        <Icon name={iconIndeterminate} size={sizeIndeterminate} />
      {:else if typeof iconIndeterminate === 'object'}
        <Icon {...iconIndeterminate} size={sizeIndeterminate} />
      {/if}
    {:else if checked}
      {#if typeof icon === 'string'}
        <Icon name={icon} {size} />
      {:else if typeof icon === 'object'}
        <Icon {...icon} {size} />
      {/if}
    {/if}
  </div>
  {#if children}
    <div class="sunp-checkbox__content">{@render children()}</div>
  {/if}
</label>
