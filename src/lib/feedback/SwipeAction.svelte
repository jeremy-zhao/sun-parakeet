<script lang="ts" module>
  import './SwipeAction.css'

  import { onMount, untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export type SwipeActionStatus =
    /** 归位状态 */
    | 'close'
    /** 左侧操作面板打开 */
    | 'left'
    /** 右侧操作面板打开 */
    | 'right'

  export interface SwipeActionAttributes extends HTMLAttributes<EventTarget> {
    /** 点击操作面板时保持位置 */
    keepOnAction?: boolean
    /** 点击其它区域时保持位置 */
    keepOnTouchOutside?: boolean
    /** 左侧的操作面板 */
    leftActions?: Snippet
    /** 右侧的操作面板 */
    rightActions?: Snippet
    /** 状态 */
    status?: SwipeActionStatus
  }

  // 滑动时判定状态变更的最小位移
  const THRESHOLD = 20
</script>

<script lang="ts">
  let {
    keepOnAction = false,
    keepOnTouchOutside = false,
    leftActions,
    rightActions,
    status: _status = $bindable('close'),
    children,
    class: clazz,
    ...props
  }: SwipeActionAttributes = $props()

  let _self: HTMLDivElement

  // 触摸控制 =================================

  let _left = $state<HTMLDivElement>()
  let _right = $state<HTMLDivElement>()

  let _pointerId: number | null | undefined
  let _start: number
  let _offset = $state(0)

  let translate = $derived(`${_offset}px 0px`)

  const min = () => 0 - (_right?.clientWidth ?? 0)
  const max = () => _left?.clientWidth ?? 0

  function reset() {
    _offset = { close: 0, left: max(), right: min() }[_status]
    _pointerId = null
  }

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    // console.log('[SwipAction]', 'handlePointerDown', e.x)
    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _start = e.x - _offset
    _self.classList.remove('sun-parakeet-swipe-action-animation')
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const offset = e.x - _start
    _offset = offset < min() ? min() : offset > max() ? max() : offset
    // console.log('[SwipAction]', 'handlePointerMove', offset)
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    // console.log('[SwipAction]', 'handlePointerUp', e.x)
    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)

    _pointerId = null
    _self.classList.add('sun-parakeet-swipe-action-animation')

    // 点击关闭
    if (
      (_status === 'left' && _offset >= max() - 1) ||
      (_status === 'right' && _offset <= min() + 1)
    ) {
      // 手动归位
      if (keepOnAction && e.composedPath().find(x => x === _left || x === _right)) return

      // 自动归位
      _status = 'close'
      return
    }

    // 滑动
    const thresholdMin =
      _status === 'right'
        ? Math.min(min() + THRESHOLD, (min() * 3) / 4)
        : Math.max(-THRESHOLD, min() / 4)

    const thresholdMax =
      _status === 'left'
        ? Math.max(max() - THRESHOLD, (max() * 3) / 4)
        : Math.min(THRESHOLD, max() / 4)

    // console.log('滑动', thresholdMin, thresholdMax)

    _status = _offset < thresholdMin ? 'right' : _offset > thresholdMax ? 'left' : 'close'
    reset()
  }

  $effect(() => {
    _status
    untrack(reset)
  })

  // 外部触摸关闭 =============================

  function handleTouchOutside(e: MouseEvent) {
    if (keepOnTouchOutside) return
    if (e.composedPath().find(x => x === _self)) return

    _status = 'close'
  }

  $effect(() => {
    const keep = keepOnTouchOutside

    untrack(() => {
      if (keep) {
        document.removeEventListener('pointerdown', handleTouchOutside)
      } else {
        document.addEventListener('pointerdown', handleTouchOutside)
      }
    })
  })

  onMount(() => {
    return () => {
      document.removeEventListener('pointerdown', handleTouchOutside)
    }
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={_self}
  class="sun-parakeet-swipe-action sun-parakeet-swipe-action-animation"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={reset}
>
  <div class="sun-parakeet-swipe-action__track" style:translate>
    {#if typeof leftActions === 'function'}
      <div
        bind:this={_left}
        class="sun-parakeet-swipe-action__actions sun-parakeet-swipe-action__actions-left"
      >
        {@render leftActions()}
      </div>
    {/if}

    <div class="sun-parakeet-swipe-action__content {clazz}" {...props}>
      {@render children?.()}
    </div>

    {#if typeof rightActions === 'function'}
      <div
        bind:this={_right}
        class="sun-parakeet-swipe-action__actions sun-parakeet-swipe-action__actions-right"
      >
        {@render rightActions()}
      </div>
    {/if}
  </div>
</div>
