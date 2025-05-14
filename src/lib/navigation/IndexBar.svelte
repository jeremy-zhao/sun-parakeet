<script lang="ts" module>
  import './IndexBar.css'

  import { onMount } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { isNonEmpty } from '../common'

  /** 序列 */
  export interface IndexBarAttributes extends HTMLAttributes<EventTarget> {
    /** 当前锚点位置 */
    index?: string
  }
</script>

<script lang="ts">
  let { index = $bindable(), children, class: clazz, ...props }: IndexBarAttributes = $props()

  let _self: HTMLDivElement
  let _content: HTMLDivElement
  let _bar: HTMLUListElement
  let _indexes = $state<string[]>([])

  function resetIndexes() {
    _indexes = [..._content.children].map(x => x.getAttribute('data-index')!).filter(x => x)
  }

  function resetIndex() {
    const scrollTop = _self.scrollTop

    let dataIndex =
      [..._content.children].find(x => x.hasAttribute('data-index'))?.getAttribute('data-index') ??
      undefined

    for (let el of _content.children) {
      if (!el.hasAttribute('data-index')) continue

      const offsetTop = (el as HTMLElement).offsetTop

      if (offsetTop > scrollTop) {
        index = dataIndex
        break
      }

      dataIndex = el.getAttribute('data-index') ?? undefined
    }
  }

  function resetScrollTop() {
    const el = [..._content.children].find(x => x.getAttribute('data-index') === index)
    if (!el) return

    el.scrollIntoView()
  }

  let _touching = $state(false)
  let _pointerId: number | null = null
  let _rect: DOMRect

  function pointerChange(e: PointerEvent) {
    const height = _bar.clientHeight
    const itemHeight = height / _indexes.length

    let offset = e.y - _rect.top
    offset = offset = offset < 0 ? 0 : offset >= height ? height - 1 : offset

    const ix = Math.floor(offset / itemHeight)
    console.log('offset', offset, ix)
    index = _indexes[ix]
    resetScrollTop()
  }

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    _bar.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _rect = _bar.getBoundingClientRect()

    pointerChange(e)

    _touching = true
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return
    pointerChange(e)
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    _bar.releasePointerCapture(e.pointerId)

    _pointerId = null
    _touching = false
  }

  function handlePointerCancel() {
    console.log('cancel')
    _pointerId = null
    _touching = false
  }

  onMount(() => {
    resetIndexes()
    resetIndex()

    const mutation = new MutationObserver(() => resetIndexes())
    mutation.observe(_content, {
      childList: true,
      attributes: true,
      attributeFilter: ['data-index'],
    })

    _self.addEventListener('scroll', resetIndex)

    _bar.addEventListener('pointerdown', handlePointerDown)
    _bar.addEventListener('pointermove', handlePointerMove)
    _bar.addEventListener('pointerup', handlePointerUp)
    _bar.addEventListener('pointercancel', handlePointerCancel)

    return () => mutation.disconnect()
  })
</script>

<div bind:this={_self} class="sunp-index-bar {clazz}" {...props}>
  <div bind:this={_content} class="sunp-index-bar__content">
    {@render children?.()}
  </div>
  <ul bind:this={_bar} class="sunp-index-bar__side-bar">
    {#each _indexes as ix}
      <li class="sunp-index-bar__side-item" class:sunp-index-bar__side-item-selected={ix === index}>
        <div class="sunp-index-bar__side-item-handle">
          {ix}
        </div>
        {#if index === ix && _touching}
          <div class="sunp-index-bar__side-item-indicator">{ix}</div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
