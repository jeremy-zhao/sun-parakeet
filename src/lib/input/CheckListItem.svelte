<script lang="ts" module>
  import './CheckListItem.css'
  import CheckIcon from '../icons/check-line.svg?raw'

  import { getContext, onMount } from 'svelte'
  import { isNonEmpty } from '../common'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { CheckListContext } from './CheckList.svelte'

  /** 可勾选条目属性 */
  export interface CheckListItemAttributes extends HTMLInputAttributes {
    /** 值。作为 CheckList 成员时必须提供 */
    value?: PropertyKey
    /** 自定义图标 */
    icon?: string | IconOption
    /** 变更事件 */
    onChange?: (checked: boolean) => void
    indeterminate?: undefined
  }
</script>

<script lang="ts">
  let checkList = getContext<CheckListContext>('sun_parakeet_check_list')

  let {
    checked = $bindable(false),
    value,
    icon = { svg: CheckIcon, class: 'sunp-check-list-item__icon' },
    indeterminate, // 屏蔽
    disabled,
    class: clazz,
    style,
    children,
    onChange,
    ...props
  }: CheckListItemAttributes = $props()

  let input: HTMLInputElement

  let size = $derived(typeof icon === 'object' && icon.size ? icon.size : 24)

  function handleChange() {
    onChange?.(!!checked)
    checkList?.onChange(value!, !!checked)
  }

  function handleCheck(chk: boolean) {
    checked = chk
    input.checked = chk
  }

  onMount(() => {
    if (checkList && !isNonEmpty(value)) {
      console.warn(
        '[CheckList]',
        'CheckListItem 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
        value
      )
      return
    }

    checkList?.register(value!, input, handleCheck)

    return () => {
      checkList?.unregister(value!)
    }
  })
</script>

<div
  class="sunp-check-list-item {clazz}"
  class:sunp-check-list-item-checked={checked}
  class:sunp-check-list-item-disabled={disabled}
  {style}
>
  <label class="sunp-check-list-item__label">
    <input
      bind:this={input}
      bind:checked
      bind:indeterminate
      class="sunp-check-list-item__element"
      type="checkbox"
      {value}
      {disabled}
      {...props}
      onchange={handleChange}
    />

    <div class="sunp-check-list-item__content">
      {@render children?.()}
    </div>

    {#if typeof icon === 'string'}
      <Icon class="sunp-check-list-item__icon" name={icon} {size} />
    {:else if typeof icon === 'object'}
      <Icon class="sunp-check-list-item__icon" {...icon} {size} />
    {/if}
  </label>
</div>
