<script lang="ts" module>
  import './Tabs.css'

  import { onMount } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { delay } from '../common'
  import Icon from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'
  import type { TabOption } from './TabBar.svelte'

  /** 标签栏 */
  export interface TabsAttributes extends HTMLAttributes<EventTarget> {
    /** 当前选中的选项卡键 */
    value?: unknown
    /** 选项卡组 */
    tabs: Array<string | TabOption>
    /** 固定在顶部 */
    fixed?: boolean
    /** 选项卡切换事件 */
    onChange?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    tabs = [],
    fixed = false,
    onChange,
    class: clazz,
    ...props
  }: TabsAttributes = $props()

  if (value === undefined || value === null) {
    const first = tabs.find(x => typeof x === 'string' || (typeof x === 'object' && !x.disabled))
    value = typeof first === 'string' ? first : typeof first === 'object' ? first.value : undefined
  }

  let nav: HTMLElement

  let lineW = $state('auto')
  let lineL = $state('auto')

  function setBaseLine(node: HTMLElement) {
    const content = node.children[0] as HTMLElement
    lineW = `${content.offsetWidth}px`
    lineL = `${content.offsetLeft}px`
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

  function setBaseLineByValue(val: unknown) {
    const index = tabs.findIndex(
      x =>
        (typeof x === 'string' && x === value) ||
        (typeof x === 'object' && x.value === value && !x.disabled)
    )

    const node = index >= 0 ? (nav.children[index] as HTMLElement) : undefined

    if (node) {
      setBaseLine(node)
    } else {
      lineW = 'auto'
      lineL = 'auto'
    }
  }

  $effect(() => {
    setBaseLineByValue(value)
  })

  onMount(() => {
    const resize = new ResizeObserver(() => {
      nav.classList.remove('sunp-tabs-animation')
      setBaseLineByValue(value)
      delay().then(() => nav.classList.add('sunp-tabs-animation'))
    })

    resize.observe(nav)

    return () => resize.disconnect()
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
  {@const selectedClazz = selected ? classSelected || 'sunp-tabs-item-selected' : ''}
  {@const selectedStyle = selected ? styleSelected || '' : ''}
  {@const iconVisible = ['string', 'object'].indexOf(typeof icon) >= 0}
  <button
    use:onTabLoad={selected}
    class="sunp-tabs-item {clazz} {selectedClazz}"
    class:sunp-tabs-item-disabled={disabled}
    style="{style} {selectedStyle}"
    onclick={e => handleClick(e, val)}
    {disabled}
  >
    <Badge class="sunp-tabs-item__inner" content={badge}>
      {#if iconVisible && typeof icon === 'string'}
        <Icon name={icon} size={22} />
      {:else if iconVisible && typeof icon === 'object'}
        <Icon {...icon} />
      {/if}
      {#if typeof label === 'string'}
        <span class="sunp-tabs-item__inner-text">{label}</span>
      {:else if typeof label === 'function'}
        {@render label(option)}
      {:else if !label && !iconVisible}
        <span class="sunp-tabs-item__inner-text">{val}</span>
      {/if}
    </Badge>
  </button>
{/snippet}

<nav
  bind:this={nav}
  class="sunp-tabs sunp-tabs-animation {clazz}"
  class:sunp-tabs-fixed={fixed}
  {...props}
>
  {#each tabs as tab}
    {#if typeof tab === 'string'}
      {@render item({ value: tab })}
    {:else if typeof tab === 'object'}
      {@render item(tab)}
    {/if}
  {/each}
  <div class="sunp-tabs__baseline" style:left={lineL} style:width={lineW}></div>
</nav>
