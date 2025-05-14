<script lang="ts" module>
  import './PullToRefresh.css'
  import LoadingIcon from '../icons/loading.svg?raw'

  import { tick, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { delay, isNonEmpty } from '../common'
  import Icon from '../common/Icon.svelte'

  /** 下拉刷新组件状态 */
  export type PullToRefreshStatus =
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

  /** 下拉刷新配置 */
  export interface PullToRefreshAttributes extends HTMLAttributes<EventTarget> {
    /** 下拉刷新头部 */
    header?: Snippet<[status: PullToRefreshStatus, offset: number]>
    /** 最大下拉高度 */
    maxPullDownDistance?: number
    /** 刷新阈值 */
    refreshThreshold?: number
    /** 震动反馈 */
    vibrate?: boolean
    /** 完成状态持续时间。填 0 表示不会进入等待状态 */
    completeDuration?: number
    /** 禁用状态 */
    disabled?: boolean | null | undefined
    /** 下拉刷新事件 */
    onRefresh?: () => any
  }
</script>

<script lang="ts">
  let _self: HTMLDivElement
  let _track: HTMLDivElement
  let _header: HTMLHeadElement
  let _content: HTMLDivElement

  let {
    completeDuration = 500,
    disabled = false,
    header,
    maxPullDownDistance = 100,
    refreshThreshold = 60,
    vibrate = false,
    onRefresh,
    class: clazz,
    children,
    ...props
  }: PullToRefreshAttributes = $props()

  let _touchId: number | null
  let _start: number
  let _offset = $state(0)
  let _status = $state<PullToRefreshStatus>('idle')

  const max = () => Math.abs(maxPullDownDistance)
  const threshold = () => Math.abs(refreshThreshold)

  let translate = $derived(`0px ${_offset}px`)

  function reset() {
    _offset = 0
    _touchId = null
  }

  function handleTouchStart(e: TouchEvent) {
    if (disabled) return
    if (_content.scrollTop) return
    if (_offset > 0) return
    if (isNonEmpty(_touchId)) return

    const touch = e.touches[0]
    if (!touch) return

    _touchId = e.touches[0].identifier
    _start = touch.clientY - _offset
    _status = 'pulling'
    _self.classList.remove('sunp-pull-to-refresh-animation')
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isNonEmpty(_touchId)) return

    const touch = [...e.touches].find(x => x.identifier === _touchId)
    if (!touch) return

    const lastStatus = _status
    const offset = (touch.clientY - _start) / 5
    _offset = offset < 0 ? 0 : offset > max() ? max() : offset
    _status = _offset <= 0 ? 'idle' : _offset < threshold() ? 'pulling' : 'loosing'

    if (vibrate && lastStatus !== 'loosing' && _status === 'loosing') {
      navigator?.vibrate?.(50)
    }

  }

  async function handleTouchEnd(e: TouchEvent) {
    if (!isNonEmpty(_touchId)) return

    const touch = [...e.touches].find(x => x.identifier === _touchId)
    if (touch) return

    _touchId = null
    _self.classList.add('sunp-pull-to-refresh-animation')

    if (_offset < threshold()) {
      _status = 'idle'
      reset()
      return
    }

    if (typeof onRefresh === 'function') {
      const refreshing = onRefresh()

      if (refreshing instanceof Promise) {
        _status = 'refreshing'
        await tick()
        _offset = Math.max(_header.clientHeight + 1, 36)
        await refreshing
      }
    }

    if (completeDuration > 0) {
      _status = 'complete'
      await tick()
      _offset = Math.max(_header.clientHeight + 1, 36)
      await delay(completeDuration)
    }

    reset()
  }
</script>

{#snippet headerSnippet(status: PullToRefreshStatus)}
  <p class="sunp-pull-to-refresh__header-inner">
    {#if status === 'idle' || status === 'pulling'}
      <span>下拉刷新</span>
    {:else if status === 'loosing'}
      <span>释放即可刷新</span>
    {:else if status === 'refreshing'}
      <Icon class="sunp-pull-to-refresh__header-loading" svg={LoadingIcon} size={20} />
      <span>加载中...</span>
    {:else if status === 'complete'}
      <span>刷新成功</span>
    {/if}
  </p>
{/snippet}

<div
  bind:this={_self}
  class="sunp-pull-to-refresh sunp-pull-to-refresh-animation {clazz}"
  {...props}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
>
  <div bind:this={_track} class="sunp-pull-to-refresh__track" style:translate>
    <header bind:this={_header} class="sunp-pull-to-refresh__header">
      {#if typeof header === 'function'}
        {@render header(_status, _offset)}
      {:else}
        {@render headerSnippet(_status)}
      {/if}
    </header>
    <div bind:this={_content} class="sunp-pull-to-refresh__content">
      {@render children?.()}
    </div>
  </div>
</div>
