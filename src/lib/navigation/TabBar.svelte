<script lang="ts" module>
  import './TabBar.css'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 选项卡设置 */
  export interface TabOption {
    /** 值 */
    value: unknown
    /** 图标 */
    icon?: string | IconOption
    /** 文字 */
    label?: string
    /** 徽标内容。boolean 显示小红点，number 显示数字，string 显示字符串 */
    badge?: boolean | number | string
    /** 未选中 css 类 */
    class?: string
    /** 未选中样式 */
    style?: string
    /** 已选中 css 类。会与 class 叠加 */
    classSelected?: string
    /** 已选中样式。会与 style 叠加 */
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
    onChange?: (key: unknown) => void
  }
</script>

<script lang="ts">
  let { value = $bindable(), class: clazz, fixed, tabs = [], onChange, ...props }: TabBarAttributes = $props()

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

{#snippet item({
  value: val,
  icon,
  label,
  badge = false,
  class: clazz,
  style,
  classSelected,
  styleSelected,
  disabled = false,
}: TabOption)}
  {@const selected = value === val && !disabled}
  {@const selectedClazz = selected ? classSelected || 'sun-parakeet-tab-bar-item__selected' : ''}
  {@const selectedStyle = selected ? styleSelected || '' : ''}
  {@const iconVisible = ['string', 'object'].indexOf(typeof icon) >= 0}
  <button
    class="sun-parakeet-tab-bar-item {clazz} {selectedClazz}"
    style="{style} {selectedStyle}"
    onclick={() => handleClick(val)}
    {disabled}
  >
    <Badge class="sun-parakeet-tab-bar-item__inner" content={badge}>
      {#if iconVisible && typeof icon === 'string'}
        <Icon name={icon} />
      {:else if iconVisible && typeof icon === 'object'}
        <Icon {...icon} />
      {/if}
      {#if label}
        <span class:sun-parakeet-tab-bar-item__text-only={!iconVisible}>{label}</span>
      {:else if !label && !iconVisible}
        <span class:sun-parakeet-tab-bar-item__text-only={true}>{val}</span>
      {/if}
    </Badge>
  </button>
{/snippet}

<nav class="sun-parakeet-tab-bar {clazz}" class:sun-parakeet-tab-bar-fixed={fixed} {...props}>
  {#each tabs as tab}
    {#if typeof tab === 'string'}
      {@render item({ value: tab })}
    {:else if typeof tab === 'object'}
      {@render item(tab)}
    {/if}
  {/each}
</nav>
