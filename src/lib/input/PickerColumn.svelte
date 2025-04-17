<script lang="ts" module>
  import './PickerColumn.css'
  import LoadingIcon from '../icons/loading.svg?raw'

  import Icon from '../common/Icon.svelte'
  import { delay, isIOS } from '../common'
  import { onMount } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface PickerItem {
    /** 显示内容，不填则显示 value */
    label?: string
    /** 值 */
    value: unknown
  }

  /** 选择器列属性 */
  export interface PickerColumnAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 条目 */
    items: PickerItem[]
    /** 当前选中的值 */
    value: unknown
    /** 加载状态 */
    loading: boolean
    /** 选择变更事件 */
    onChange: (value: unknown) => void
  }
</script>

<script lang="ts">
  let { items, value, loading, onChange }: PickerColumnAttributes = $props()

  let container: HTMLElement

  let ios = $state(false)
  let width = $state(0)
  let height = $state(0)
  let itemHeight = $state(0)
  let padding = $derived(height / 2 + itemHeight)

  let maxw = $derived(`${width - 16}px`)

  // 加载过程 ==========================================================

  function onLoad(node: HTMLElement) {
    const resize = new ResizeObserver(entries => {
      if (!entries?.length) return
      width = entries[0].borderBoxSize[0].inlineSize
      height = entries[0].borderBoxSize[0].blockSize
    })

    resize.observe(node)

    return {
      destroy() {
        resize.disconnect()
      },
    }
  }

  function onLoadItem(node: HTMLElement, index: number) {
    if (index !== 0) return

    const resize = new ResizeObserver(entries => {
      if (!entries?.length) return
      itemHeight = entries[0].borderBoxSize[0].blockSize
    })

    resize.observe(node)

    return {
      destroy() {
        resize.disconnect()
      },
    }
  }

  // 滚动控制 ==========================================================

  let touching = false
  let scrolling: NodeJS.Timeout | undefined

  function calcIndex() {
    const re = Math.round(
      (container.scrollTop - (padding - height / 2 + itemHeight / 2)) / itemHeight
    )
    // console.log(`(${padding} - ${height} / 2 + ${itemHeight} / 2 + ${container.scrollTop}) / ${itemHeight} = ${re}`)
    return re
  }

  // 对齐条目
  function alignTo(index: number) {
    const top = padding - height / 2 + itemHeight / 2 + index * itemHeight
    // console.log(`${padding} - ${height} / 2 + ${itemHeight} / 2 + ${index} * ${itemHeight} = ${top}`)

    if (container.scrollTop === top) return false

    container.scrollTo({ top })
    // console.log('[PickerColumn] 对齐', value, top, container.scrollTop)
    return true
  }

  function onScroll(e: Event) {
    if (loading || touching) return

    if (scrolling) {
      clearInterval(scrolling)
    } else {
      // console.log('[PickerColumn] 滚动开始', value)
    }

    scrolling = setInterval(() => !touching && onScrollEnd(), 100)
  }

  function onScrollEnd() {
    clearInterval(scrolling)
    scrolling = undefined

    if (!container || !items?.length) return

    let index = calcIndex()
    if (index >= items.length) index = items.length - 1
    if (index < 0 || index == -0) index = 0

    const item = items[index]
    // console.log('[PickerColumn] 滚动停止', item.value)

    if (item.value == value) {
      alignTo(index)
    } else {
      onChange(item.value)
    }
  }

  function onTouchStart(e: TouchEvent) {
    touching = !!e.touches.length
  }

  async function onTouchEnd(e: TouchEvent) {
    touching = !!e.touches.length
    if (touching) return

    await delay(10) // 等待 onScroll 执行
    !scrolling && onScrollEnd()
  }

  $effect(() => {
    if (!items?.length) return
    if (scrolling) return

    const index = items.findIndex(x => x.value == value)
    if (index < 0) return

    alignTo(index)
  })

  // 防卡壳 ==========================================================

  let interval: NodeJS.Timeout | undefined

  function antiJamming() {
    if (scrolling || touching || !items?.length || !value) return

    const index = items.findIndex(x => x.value == value)
    if (index < 0) return

    alignTo(index)
  }

  onMount(() => {
    ios = isIOS()
    interval = setInterval(antiJamming, 500)
    return () => clearInterval(interval)
  })
</script>

<div use:onLoad class="sunp-picker-column" class:loading>
  <!-- <div class="absolute top-0 z-30">{scrolling}</div> -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <ul
    class="sunp-picker-column__container"
    class:ios
    bind:this={container}
    onscroll={onScroll}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    {#if loading}
      <Icon svg={LoadingIcon} class="sunp-picker-column__loading-icon" />
    {:else}
      <li style:height={`${padding}px`}></li>
      {#each items as item, index}
        <li use:onLoadItem={index} class="sunp-picker-item">
          <span class="sunp-picker-item__label" style:max-width={maxw}
            >{item.label ?? item.value}</span
          >
        </li>
      {/each}
      <li style:height={`${padding}px`}></li>
    {/if}
  </ul>
</div>
