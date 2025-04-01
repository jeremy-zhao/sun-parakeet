<script lang="ts" module>
  import './SwipeAction.css'

  import { type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface SwipeActionAttributes extends HTMLAttributes<EventTarget> {
    /** 左侧的操作列表 */
    leftActions?: Snippet
    /** 右侧的操作列表 */
    rightActions?: Snippet
  }
</script>

<script lang="ts">
  let { children, leftActions, rightActions, class: clazz, ...props }: SwipeActionAttributes = $props()

  let _self: HTMLDivElement
  let _state = $state<'center' | 'left' | 'right'>('center')

  let _left = $state<HTMLDivElement>()
  let _right = $state<HTMLDivElement>()

  let min = $derived(0 - (_right?.clientWidth ?? 0))
  let max = $derived(_left?.clientWidth ?? 0)

  let _pointerId: number | null | undefined
  let _start: number
  let _offset = $state(0)

  let translate = $derived(`${_offset}px 0px`)

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    console.log('[SwipAction]', 'handlePointerDown', e.x)
    _pointerId = e.pointerId
    _self.setPointerCapture(e.pointerId)
    _start = e.x - _offset
    _self.classList.remove('sun-parakeet-swipe-action-animation')
  }

  function handlePointerMove(e: PointerEvent) {
    if (!_pointerId) return

    const offset = e.x - _start
    _offset = offset < min ? min : offset > max ? max : offset
    // console.log('[SwipAction]', 'handlePointerMove', offset)
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    console.log('[SwipAction]', 'handlePointerUp', e.x)
    _pointerId = null
    _self.releasePointerCapture(e.pointerId)
    _self.classList.add('sun-parakeet-swipe-action-animation')

    if ((_state === 'left' && _offset === max) || (_state === 'right' && _offset === min)) {
      _offset = 0
      _state = 'center'
      return
    }

    const halfMin = min / 2
    const halfMax = max / 2

    if (_offset < halfMin) {
      _offset = min
      _state = 'right'
    } else if (_offset > halfMax) {
      _offset = max
      _state = 'left'
    } else {
      _offset = 0
      _state = 'center'
    }

    _offset = _offset < halfMin ? min : _offset > halfMax ? max : 0
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={_self}
  class="sun-parakeet-swipe-action"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
>
  <div class="sun-parakeet-swipe-action__track" style:translate>
    {#if typeof leftActions === 'function'}
      <div bind:this={_left} class="sun-parakeet-swipe-action__actions sun-parakeet-swipe-action__actions-left">
        {@render leftActions()}
      </div>
    {/if}

    <div class="sun-parakeet-swipe-action__content {clazz}" {...props}>
      {@render children?.()}
    </div>

    {#if typeof rightActions === 'function'}
      <div bind:this={_right} class="sun-parakeet-swipe-action__actions sun-parakeet-swipe-action__actions-right">
        {@render rightActions()}
      </div>
    {/if}
  </div>
</div>
