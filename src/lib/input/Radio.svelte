<script lang="ts" module>
  import './Radio.css'
  import RadioIcon from '../icons/radio-line.svg?raw'

  import { getContext, onMount } from 'svelte'
  import { isNonEmpty } from '../common'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { RadioGroupContext } from './RadioGroup.svelte'

  /** 单选框属性 */
  export interface RadioAttributes extends HTMLInputAttributes {
    /** 值。作为 RadioGroup 成员时必须提供 */
    value?: PropertyKey
    /** 自定义图标 */
    icon?: string | IconOption
    /** 选中状态变更事件 */
    onChange?: (checked: boolean) => void
  }
</script>

<script lang="ts">
  let group = getContext<RadioGroupContext>('sun_parakeet_radio_group')

  let {
    checked = $bindable(false),
    value,
    name,
    icon,
    disabled,
    class: clazz,
    style,
    children,
    onChange,
    ...props
  }: RadioAttributes = $props()

  let input: HTMLInputElement

  let size = $derived(typeof icon === 'object' && icon.size ? icon.size : 22)

  function handleChange() {
    checked = input.checked
    onChange?.(!!checked)
    group?.onChange()
  }

  function handleCheck(chk: boolean) {
    checked = chk
  }

  onMount(() => {
    if (group && !isNonEmpty(value)) {
      console.warn(
        '[RadioGroup]',
        'Radio 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
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
  class="sunp-radio {clazz}"
  class:sunp-radio-checked={checked}
  class:sunp-radio-disabled={disabled}
  {style}
>
  <input
    bind:this={input}
    {checked}
    class="sunp-radio__input"
    type="radio"
    name={name ?? group?.name}
    {value}
    {disabled}
    {...props}
    onchange={handleChange}
  />
  <div class="sunp-radio__icon" style:width="{size}px" style:height="{size}px">
    {#if checked}
      {#if typeof icon === 'string'}
        <Icon name={icon} {size} />
      {:else if typeof icon === 'object'}
        <Icon {...icon} {size} />
      {:else}
        <Icon class="sunp-radio__icon-default" svg={RadioIcon} {size} />
      {/if}
    {/if}
  </div>
  {#if children}
    <div class="sunp-radio__content">{@render children()}</div>
  {/if}
</label>
