<script lang="ts" module>
  import './SideBar.css'

  import Icon from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TabOption } from './TabBar.svelte'

  /** 标签栏 */
  export interface SideBarAttributes extends HTMLAttributes<EventTarget> {
    /** 选项卡组 */
    tabs: Array<string | TabOption>
    /** 当前选中的选项卡键 */
    value?: unknown
    /** 选项卡切换事件 */
    onChange?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    tabs = [],
    onChange,
    class: clazz,
    ...props
  }: SideBarAttributes = $props()

  if (value === undefined || value === null) {
    const first = tabs.find(x => typeof x === 'string' || (typeof x === 'object' && !x.disabled))
    value = typeof first === 'string' ? first : typeof first === 'object' ? first.value : undefined
  }

  let nav: HTMLElement

  let lineW = $state(0)
  let lineL = $state(0)

  function setBaseLine(node: HTMLElement) {
    const content = node.children[0] as HTMLElement
    lineW = content.offsetWidth
    lineL = content.offsetLeft
  }

  function handleClick(e: Event, key: unknown) {
    if (value == key) return
    value = key
    onChange?.(key)

    const target = e.currentTarget as HTMLElement
    setBaseLine(target)

    let left = target.offsetLeft - (nav.clientWidth - target.clientWidth) / 2

    nav.scrollTo({
      left: left > 0 ? left : 0,
      behavior: 'smooth',
    })
  }

  function onTabLoad(node: HTMLElement, selected: boolean) {
    if (!selected) return
    setBaseLine(node)
  }

  $effect(() => {
    const index = tabs.findIndex(
      x =>
        (typeof x === 'string' && x === value) ||
        (typeof x === 'object' && x.value === value && !x.disabled)
    )

    const node = index >= 0 ? (nav.children[index] as HTMLElement) : undefined

    if (node) {
      setBaseLine(node)
    } else {
      lineW = 0
      lineL = 0
    }
  })
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
  {@const selectedClazz = selected ? classSelected || 'sunp-side-bar-item-selected' : ''}
  {@const selectedStyle = selected ? styleSelected || '' : ''}
  {@const iconVisible = ['string', 'object'].indexOf(typeof icon) >= 0}
  <button
    use:onTabLoad={selected}
    class="sunp-side-bar-item {clazz} {selectedClazz}"
    class:sunp-side-bar-item-disabled={disabled}
    style="{style}; {selectedStyle}"
    onclick={e => handleClick(e, val)}
    {disabled}
  >
    <Badge class="sunp-side-bar-item__inner" content={badge}>
      {#if iconVisible && typeof icon === 'string'}
        <Icon class="sunp-side-bar-item__inner-icon" name={icon} size={22} />
      {:else if iconVisible && typeof icon === 'object'}
        <Icon class="sunp-side-bar-item__inner-icon" {...icon} />
      {/if}
      {#if typeof label === 'string'}
        <span class="sunp-side-bar-item__inner-text">{label}</span>
      {:else if typeof label === 'function'}
        {@render label(option)}
      {:else if !label && !iconVisible}
        <span class="sunp-side-bar-item__inner-text">{val}</span>
      {/if}
    </Badge>
  </button>
{/snippet}

<nav bind:this={nav} class="sunp-side-bar {clazz}" {...props}>
  {#each tabs as tab}
    {#if typeof tab === 'string'}
      {@render item({ value: tab })}
    {:else if typeof tab === 'object'}
      {@render item(tab)}
    {/if}
  {/each}
</nav>
