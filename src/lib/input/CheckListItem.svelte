<script lang="ts" module>
  import './CheckListItem.css'
  import CheckIcon from '../icons/check-line.svg?raw'

  import { getContext, onMount, type Snippet } from 'svelte'
  import { isNonEmpty } from '../common'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import ListItem from '../display/ListItem.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { CheckListContext } from './CheckList.svelte'

  /** 可勾选条目属性 */
  export interface CheckListItemAttributes extends HTMLInputAttributes {
    /** 列表项左侧区域 */
    aside?: Snippet
    /** 列表项下部显示的描述 */
    description?: string | Snippet
    /** 列表项主题上部的标题区域 */
    header?: string | Snippet
    /** 自定义图标 */
    icon?: string | IconOption
    /** 值。作为 check-listGroup 成员时必须提供 */
    value?: PropertyKey
    /** 数据变更事件 */
    onChange?: (checked: boolean) => void
    // 屏蔽
    indeterminate?: undefined
  }
</script>

<script lang="ts">
  let checkList = getContext<CheckListContext>('sun_parakeet_check_list')

  let {
    checked = $bindable(false),
    value,
    aside,
    description,
    header,
    icon = { svg: CheckIcon, class: 'sun-parakeet-check-list-item__icon' },
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

  function handleClick() {
    if (disabled) return
    checked = !checked
  }

  function handleChange() {
    onChange?.(!!checked)
    checkList?.onChange()
  }

  function handleCheck(chk: boolean) {
    checked = chk
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

<label
  class="sun-parakeet-check-list-item {clazz}"
  class:sun-parakeet-check-list-item-checked={checked && !indeterminate}
  class:sun-parakeet-check-list-item-indeterminate={indeterminate}
  class:sun-parakeet-check-list-item-disabled={disabled}
  {style}
>
  <input
    bind:this={input}
    bind:checked
    bind:indeterminate
    class="sun-parakeet-check-list-item__element"
    type="checkbox"
    {value}
    {disabled}
    {...props}
    onchange={handleChange}
  />
  <ListItem
    class="sun-parakeet-check-list-item__inner"
    clickable={!disabled}
    {aside}
    {description}
    onclick={handleClick}
  >
    {@render children?.()}
    {#snippet extra()}
      {#if typeof icon === 'string'}
        <Icon name={icon} {size} />
      {:else if typeof icon === 'object'}
        <Icon {...icon} {size} />
      {/if}
    {/snippet}
  </ListItem>
</label>
