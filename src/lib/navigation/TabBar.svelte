<script lang="ts" module>
  import './TabBar.css'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 选项卡设置 */
  export interface TabOption {
    /** 选项卡键 */
    key: unknown
    /** 图标 */
    icon?: string | IconOption
    /** 文字 */
    text?: string
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
  }

  /** 标签栏 */
  export interface TabBarAttributes extends HTMLAttributes<HTMLElement> {
    /** 当前选中的选项卡键 */
    value?: unknown
    /** 选项卡组 */
    tabs: TabOption[]
    /** 固定在底部 */
    fixed?: boolean
    /** 选项卡切换事件 */
    onchange?: (key: unknown) => void
  }
</script>

<script lang="ts">
  let { value = $bindable(), class: clazz, fixed, tabs = [], onchange, ...props }: TabBarAttributes = $props()

  function handleClick(key: unknown) {
    if (value === key) return
    value = key
    onchange?.(key)
  }
</script>

<nav class="sun-parakeet-tab-bar {clazz}" class:sun-parakeet-tab-bar-fixed={fixed} {...props}>
  {#each tabs as { key, icon, text, badge = false, class: clazz, style, classSelected, styleSelected }}
    {@const selected = key === value}
    {@const selectedClazz = selected ? classSelected || 'sun-parakeet-tab-bar-item__selected' : ''}
    {@const selectedStyle = selected ? styleSelected || '' : ''}
    <button
      class="sun-parakeet-tab-bar-item {clazz} {selectedClazz}"
      style="{style} {selectedStyle}"
      onclick={() => handleClick(key)}
    >
      <Badge class="sun-parakeet-tab-bar-item__inner" content={badge}>
        {#if icon && typeof icon === 'string'}
          <Icon name={icon} />
        {:else if icon && typeof icon === 'object'}
          <Icon {...icon} />
        {/if}
        {#if text}
          <span class:sun-parakeet-tab-bar-item__text-only={!icon}>{text}</span>
        {/if}
      </Badge>
    </button>
  {/each}
</nav>
