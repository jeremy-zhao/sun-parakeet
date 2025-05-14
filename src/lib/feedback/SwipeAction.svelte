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
    /** 状态 */
    status?: SwipeActionStatus
    /** 左侧的操作面板 */
    leftActions?: Snippet
    /** 右侧的操作面板 */
    rightActions?: Snippet
    /** 点击操作面板时保持位置 */
    keepOnAction?: boolean
    /** 点击其它区域时保持位置 */
    keepOnTouchOutside?: boolean
  }

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

    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _start = e.x - _offset
    _self.classList.remove('sunp-swipe-action-animation')
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const offset = e.x - _start
    _offset = offset < min() ? min() : offset > max() ? max() : offset
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)

    _pointerId = null
    _self.classList.add('sunp-swipe-action-animation')

    if (
      (_status === 'left' && _offset >= max() - 1) ||
      (_status === 'right' && _offset <= min() + 1)
    ) {
      if (keepOnAction && e.composedPath().find(x => x === _left || x === _right)) return

      _status = 'close'
      return
    }

    const thresholdMin =
      _status === 'right'
        ? Math.min(min() + THRESHOLD, (min() * 3) / 4)
        : Math.max(-THRESHOLD, min() / 4)

    const thresholdMax =
      _status === 'left'
        ? Math.max(max() - THRESHOLD, (max() * 3) / 4)
        : Math.min(THRESHOLD, max() / 4)

    _status = _offset < thresholdMin ? 'right' : _offset > thresholdMax ? 'left' : 'close'
    reset()
  }

  $effect(() => {
    _status
    untrack(reset)
  })

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

<div
  bind:this={_self}
  class="sunp-swipe-action sunp-swipe-action-animation"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={reset}
>
  <div class="sunp-swipe-action__track" style:translate>
    {#if typeof leftActions === 'function'}
      <div bind:this={_left} class="sunp-swipe-action__actions sunp-swipe-action__actions-left">
        {@render leftActions()}
      </div>
    {/if}

    <div class="sunp-swipe-action__content {clazz}" {...props}>
      {@render children?.()}
    </div>

    {#if typeof rightActions === 'function'}
      <div bind:this={_right} class="sunp-swipe-action__actions sunp-swipe-action__actions-right">
        {@render rightActions()}
      </div>
    {/if}
  </div>
</div>
