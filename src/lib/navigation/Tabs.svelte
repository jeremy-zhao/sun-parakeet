<script lang="ts" module>
  import './Tabs.css'

  import Icon from '../common/Icon.svelte'
  import Badge from '../display/Badge.svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TabOption } from './TabBar.svelte'

  /** 标签栏 */
  export interface TabsAttributes extends HTMLAttributes<HTMLElement> {
    /** 当前选中的选项卡键 */
    value?: unknown
    /** 选项卡组 */
    tabs: TabOption[]
    /** 选项卡切换事件 */
    onchange?: (key: unknown) => void
  }
</script>

<script lang="ts">
  let { value = $bindable(), class: clazz, tabs = [], onchange, ...props }: TabsAttributes = $props()

  let nav: HTMLElement

  let lineW = $state(0)
  let lineL = $state(0)

  if (tabs.findIndex(x => x.key == value) < 0) {
    value = tabs[0].key
  }

  function setBaseLine(node: HTMLElement) {
    const content = node.children[0] as HTMLElement
    lineW = content.offsetWidth
    lineL = content.offsetLeft
  }

  function handleClick(e: Event, key: unknown) {
    if (value == key) return
    value = key
    onchange?.(key)

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
    const index = tabs.findIndex(x => x.key === value && !x.disabled)
    const node = index >= 0 ? (nav.children[index] as HTMLElement) : undefined

    if (node) {
      setBaseLine(node)
    } else {
      lineW = 0
      lineL = 0
    }
  })
</script>

<nav bind:this={nav} class="sun-parakeet-tabs {clazz}" {...props}>
  {#each tabs as { key, icon, text, badge, class: clazz, style, classSelected, styleSelected, disabled = false }}
    {@const selected = key === value && !disabled}
    {@const selectedClazz = selected ? classSelected || 'sun-parakeet-tabs-item__selected' : ''}
    {@const selectedStyle = selected ? styleSelected || '' : ''}
    <button
      use:onTabLoad={selected}
      class="sun-parakeet-tabs-item {clazz} {selectedClazz}"
      style="{style} {selectedStyle}"
      onclick={e => handleClick(e, key)}
      {disabled}
    >
      <Badge class="sun-parakeet-tabs-item__inner" content={badge}>
        {#if icon && typeof icon === 'string'}
          <Icon name={icon} size={22} />
        {:else if icon && typeof icon === 'object'}
          <Icon {...icon} />
        {/if}
        {#if text}
          <span class="sun-parakeet-tabs-item__inner-text">{text}</span>
        {/if}
      </Badge>
    </button>
  {/each}
  <div class="sun-parakeet-tabs__baseline" style:left={`${lineL}px`} style:width={`${lineW}px`}></div>
</nav>
