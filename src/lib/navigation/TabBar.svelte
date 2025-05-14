<script lang="ts" module>
  import './TabBar.css'

  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Icon, { type IconOption } from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'

  /** 选项卡设置 */
  export interface TabOption {
    /** 值 */
    value: unknown
    /** 图标 */
    icon?: string | IconOption
    /** 文字 */
    label?: string | Snippet<[TabOption]>
    /** 徽标内容。boolean 显示小红点，number 显示数字，string 显示字符串 */
    badge?: boolean | number | string
    /** 未选中 css 类 */
    class?: string
    /** 未选中样式 */
    style?: string
    /** 已选中 css 类 */
    classSelected?: string
    /** 已选中样式 */
    styleSelected?: string
    /** 是否禁用 */
    disabled?: boolean
  }

  /** 标签栏 */
  export interface TabBarAttributes extends HTMLAttributes<EventTarget> {
    /** 当前选中的选项卡键 */
    value?: unknown
    /** 选项卡组 */
    tabs: Array<string | TabOption>
    /** 固定在底部 */
    fixed?: boolean
    /** 选项卡切换事件 */
    onChange?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    tabs = [],
    fixed,
    onChange,
    class: clazz,
    ...props
  }: TabBarAttributes = $props()

  if (value === undefined || value === null) {
    const first = tabs.find(x => typeof x === 'string' || (typeof x === 'object' && !x.disabled))
    value = typeof first === 'string' ? first : typeof first === 'object' ? first.value : undefined
  }

  function handleClick(key: unknown) {
    if (value === key) return
    value = key
    onChange?.(key)
  }
</script>

{#snippet item(option: TabOption)}
  {@const {
    value: val,
    icon,
    label,
    badge = false,
    class: clazz,
    style,
    classSelected,
    styleSelected,
    disabled = false,
  } = option}
  {@const selected = value === val && !disabled}
  {@const selectedClazz = selected ? classSelected || 'sunp-tab-bar-item-selected' : ''}
  {@const selectedStyle = selected ? styleSelected || '' : ''}
  {@const iconVisible = ['string', 'object'].indexOf(typeof icon) >= 0}
  <button
    class="sunp-tab-bar-item {clazz} {selectedClazz}"
    class:sunp-tab-bar-item-disabled={disabled}
    style="{style} {selectedStyle}"
    onclick={() => handleClick(val)}
    {disabled}
  >
    <Badge class="sunp-tab-bar-item__inner" content={badge}>
      {#if iconVisible && typeof icon === 'string'}
        <Icon name={icon} />
      {:else if iconVisible && typeof icon === 'object'}
        <Icon {...icon} />
      {/if}
      {#if typeof label === 'string'}
        <span class:sunp-tab-bar-item__text-only={!iconVisible}>{label}</span>
      {:else if typeof label === 'function'}
        {@render label(option)}
      {:else if !label && !iconVisible}
        <span class:sunp-tab-bar-item__text-only={true}>{val}</span>
      {/if}
    </Badge>
  </button>
{/snippet}

<nav class="sunp-tab-bar {clazz}" class:sunp-tab-bar-fixed={fixed} {...props}>
  {#each tabs as tab}
    {#if typeof tab === 'string'}
      {@render item({ value: tab })}
    {:else if typeof tab === 'object'}
      {@render item(tab)}
    {/if}
  {/each}
</nav>
