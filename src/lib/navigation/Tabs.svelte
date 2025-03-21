<script lang="ts" module>
  import './Tabs.css'

  import Icon from '../common/Icon.svelte'
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

  let lineW = $state(0)
  let lineL = $state(0)

  function setBaseLine(node: HTMLElement) {
    const content = node.children[0] as HTMLElement
    lineW = content.offsetWidth
    lineL = content.offsetLeft
  }

  function handleClick(e: Event, key: unknown) {
    if (value === key) return
    value = key
    onchange?.(key)

    const target = e.currentTarget as HTMLElement
    target.scrollIntoView()

    setBaseLine(target)
  }

  function onTabLoad(node: HTMLElement, selected: boolean) {
    if (!selected) return
    setBaseLine(node)
  }
</script>

<nav class="sun-parakeet-tabs {clazz}" {...props}>
  {#each tabs as { key, icon, text, badge, class: className, style, classSelected, styleSelected }}
    <button
      use:onTabLoad={key == value}
      class="sun-parakeet-tabs-item"
      class:text-blue={key == value}
      onclick={e => handleClick(e, key)}
    >
      <div class="sun-parakeet-tabs-item__inner">
        {#if icon && typeof icon === 'string'}
          <Icon name={icon} size={22} />
        {:else if icon && typeof icon === 'object'}
          <Icon {...icon} />
        {/if}
        {#if text}
          <span class="mx-1 whitespace-nowrap text-nowrap text-[14px]">{text}</span>
        {/if}
      </div>
    </button>
  {/each}
  <div class="sun-parakeet-tabs__baseline" style:left={`${lineL}px`} style:width={`${lineW}px`}></div>
</nav>
