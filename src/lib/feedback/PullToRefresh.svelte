<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import './PullToRefresh.css'

  import { tick } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { delay, isNonEmpty } from '$lib/common'

  /** 下拉刷新组件状态 */
  export type PullToRefreshState =
    /** 空闲状态 */
    | 'idle'
    /** 下拉中 */
    | 'pulling'
    /** 下拉超过阈值，释放会触发刷新 */
    | 'loosing'
    /** 刷新中 */
    | 'refreshing'
    /** 完成 */
    | 'complete'

  /** 下拉刷新头部显示配置 */
  export interface PullToRefreshHeader {
    /** 下拉中显示的文本 */
    pulling?: string
    /** 下拉超过阈值，提示释放会触发刷新时显示的文本 */
    loosing?: string
    /** 刷新时显示的文本 */
    refreshing?: string
    /** 完成时显示的文本。不提供此值时，刷新完毕直接收起 */
    complete?: string
  }

  /** 下拉刷新配置 */
  export interface PullToRefreshAttributes extends HTMLAttributes<EventTarget> {
    /** 禁用状态 */
    disabled?: boolean | null | undefined
    /** 下拉刷新头部 */
    header?: PullToRefreshHeader | Snippet<[state: PullToRefreshState]>
    /** 最大下拉高度 */
    maxPullDownDistance?: number
    /** 刷新阈值 */
    refreshThreshold?: number
    /** 下拉刷新事件 */
    onRefresh?: () => any
  }
</script>

<script lang="ts">
  let {
    disabled = false,
    header = {},
    maxPullDownDistance = 100,
    refreshThreshold = 60,
    onRefresh,
    class: clazz,
    children,
    ...props
  }: PullToRefreshAttributes = $props()

  let _self: HTMLDivElement
  let _track: HTMLDivElement
  let _header: HTMLHeadElement
  let _content: HTMLDivElement

  // 触摸控制 =================================

  let _touchId: number | null
  let _start: number
  let _offset = $state(0)
  let _state = $state<PullToRefreshState>('idle')

  const max = () => Math.abs(maxPullDownDistance)
  const threshold = () => Math.abs(refreshThreshold)

  // 偏移量
  let translate = $derived(`0px ${_offset}px`)

  // 重置
  function reset() {
    _offset = 0
    _touchId = null
  }

  function handleTouchStart(e: TouchEvent) {
    if (_content.scrollTop) return
    if (isNonEmpty(_touchId)) return

    const touch = e.touches[0]
    if (!touch) return

    // console.log('[PullToRefresh]', 'handlePointerDown', touch.clientY)

    _touchId = e.touches[0].identifier
    _start = touch.clientY - _offset
    _state = 'pulling'
    _self.classList.remove('sun-parakeet-pull-to-refresh-animation')
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isNonEmpty(_touchId)) return

    const touch = [...e.touches].find(x => x.identifier === _touchId)
    if (!touch) return

    const offset = (touch.clientY - _start) / 5
    _offset = offset < 0 ? 0 : offset > max() ? max() : offset
    _state = _offset <= 0 ? 'idle' : _offset < threshold() ? 'pulling' : 'loosing'

    // console.log('[PullToRefresh]', 'handlePointerMove', offset)
  }

  async function handleTouchEnd(e: TouchEvent) {
    if (!isNonEmpty(_touchId)) return

    const touch = [...e.touches].find(x => x.identifier === _touchId)
    if (touch) return

    // console.log('[PullToRefresh]', 'handlePointerUp')

    _touchId = null
    _self.classList.add('sun-parakeet-pull-to-refresh-animation')

    // 未超过阈值
    if (_offset < threshold()) {
      _state = 'idle'
      reset()
      return
    }

    // 刷新
    if (typeof onRefresh === 'function') {
      const refreshing = onRefresh()

      if (refreshing instanceof Promise) {
        _state = 'refreshing'
        await tick()
        _offset = Math.max(_header.clientHeight + 1, 36)
        await refreshing
      }
    }

    // 完成
    _state = 'complete'
    await tick()
    _offset = Math.max(_header.clientHeight + 1, 36)

    await delay(500)
    reset()
  }

  function handleTouchCancel() {
    console.log('cancel')
  }
</script>

{#snippet headerSnippet(state: PullToRefreshState, header: PullToRefreshHeader)}
  <p class="sun-parakeet-pull-to-refresh__header-inner">
    {#if state === 'idle' || state === 'pulling'}
      {header.pulling ?? '下拉刷新'}
    {:else if state === 'loosing'}
      {header.loosing ?? '释放即可刷新'}
    {:else if state === 'refreshing'}
      {header.refreshing ?? '加载中...'}
    {:else if state === 'complete'}
      {header.complete ?? '刷新成功'}
    {/if}
  </p>
{/snippet}

<div
  bind:this={_self}
  class={['sun-parakeet-pull-to-refresh', 'sun-parakeet-pull-to-refresh-animation', clazz]
    .filter(x => x)
    .join(' ')}
  {...props}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  ontouchcancel={handleTouchCancel}
>
  <div bind:this={_track} class="sun-parakeet-pull-to-refresh__track" style:translate>
    <header bind:this={_header} class="sun-parakeet-pull-to-refresh__header">
      {#if typeof header === 'object'}
        {@render headerSnippet(_state, header)}
      {:else if typeof header === 'function'}
        {@render header(_state)}
      {/if}
    </header>
    <div bind:this={_content} class="sun-parakeet-pull-to-refresh__content">
      {@render children?.()}
    </div>
  </div>
</div>
