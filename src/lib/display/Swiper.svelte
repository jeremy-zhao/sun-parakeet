<script lang="ts" module>
  import './Swiper.css'

  import { untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PageIndicator from './PageIndicator.svelte'

  export interface SwiperAttributes extends HTMLAttributes<EventTarget> {
    /** 自动切换 */
    autoplay?: boolean
    /** 自动切换的时间间隔，单位 ms */
    autoplayInterval?: number
    /** 方向。默认值 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 是否循环 */
    loop?: boolean
    /** 当前播放的索引 */
    value?: number
    /** 切换时触发 */
    onChange?: (value: number) => void
    /** 点击面板时触发 */
    onClick?: (value: number) => void
  }

  // 点击判定阈值
  const CLICK_THRESHOLD = 2
  // 时间阈值
  const TIME_THRESHOLD = 100
  // 速度阈值
  const VELOCITY_THRESHOLD = 0.5
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    autoplay = false,
    autoplayInterval = 3000,
    direction = 'horizontal',
    loop = false,
    onChange,
    onClick,
    class: clazz,
    children,
    ...props
  }: SwiperAttributes = $props()

  let _self: HTMLDivElement

  // 总数变更 =================================

  let total = $state(0)

  function useTrack(node: HTMLDivElement) {
    total = node.children.length

    const observer = new MutationObserver(cb => {
      const childList = cb.find(x => x.type === 'childList')
      if (!childList) return
      total = node.children.length
    })

    observer.observe(node, { childList: true, subtree: false })

    return {
      destroy() {
        observer.disconnect()
      },
    }
  }

  // 自动播放 =================================

  let interval: NodeJS.Timeout | undefined

  function play() {
    stop()
    if (!autoplay) return

    interval = setTimeout(() => {
      value = (value + 1) % total
      play()
    }, autoplayInterval)
  }

  function stop() {
    if (!interval) return

    clearTimeout(interval)
    interval = undefined
  }

  $effect(() => {
    if (autoplay) play()
    else stop()
  })

  // 触摸控制 =================================

  let _pointerId: number | null
  let _start: number
  let _offset = $state(0)
  let translate = $derived(`${_offset}px 0px`)

  const min = () => 0 - (total - 1) * _self.clientWidth
  const max = () => 0

  let _move: { x: number; y: number; t: number }[] = []

  function record(e: PointerEvent) {
    _move.push({ x: e.x, y: e.y, t: Date.now() })
  }

  function getVelocity() {
    if (_move.length < 2) return 0

    let j = _move.length - 1
    let i = j - 1
    let dt = 0

    for (; i >= 0; i--) {
      dt = _move[j].t - _move[i].t
      if (dt > TIME_THRESHOLD) break
    }

    if (i < 0) i = 0

    if (direction === 'horizontal') {
      return (_move[j].x - _move[i].x) / dt
    } else {
      return (_move[j].y - _move[i].y) / dt
    }
  }

  function reset() {
    _offset = 0 - value * _self.clientWidth
    _pointerId = null
    _move = []
  }

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    // console.log('[SwipAction]', 'handlePointerDown', e.x)
    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _start = e.x - _offset
    _self.classList.remove('sun-parakeet-swiper-animation')

    record(e)
    stop()
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const offset = e.x - _start
    _offset = offset < min() ? min() : offset > max() ? max() : offset
    // console.log('[SwipAction]', 'handlePointerMove', offset)

    record(e)
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    // console.log('[SwipAction]', 'handlePointerUp')
    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)

    _pointerId = null
    _self.classList.add('sun-parakeet-swiper-animation')

    // 点击
    const offset0 = 0 - _self.clientWidth * value
    const distance = _offset - offset0

    if (Math.abs(distance) < CLICK_THRESHOLD) {
      reset()
      onClick?.(value)
      return
    }

    // 滑动
    let next = Math.floor((-_offset + _self.clientWidth / 2) / _self.clientWidth)

    const offset = next * _self.clientWidth + _offset
    let sub = offset > 0 ? next - 1 : offset < 0 ? next + 1 : next
    sub = sub < 0 ? 0 : sub >= total ? total - 1 : sub

    record(e)
    const velocity = getVelocity()
    const over = Math.abs(velocity) > VELOCITY_THRESHOLD

    if (velocity < 0 && next < sub && over) {
      next++
    } else if (velocity > 0 && next > sub && over) {
      next--
    }

    next = next < 0 ? 0 : next >= total ? total - 1 : next

    value = next
    reset()
    play()
  }

  $effect(() => {
    value
    untrack(reset)
  })
</script>

<div
  bind:this={_self}
  class={[
    'sun-parakeet-swiper',
    `sun-parakeet-swiper-${direction}`,
    'sun-parakeet-swiper-animation',
    clazz,
  ]
    .filter(x => x)
    .join(' ')}
  {...props}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={reset}
>
  <div use:useTrack class="sun-parakeet-swiper__track" style:translate>
    {@render children?.()}
  </div>
  <PageIndicator class="sun-parakeet-swiper__indicator" {total} {value} />
</div>
