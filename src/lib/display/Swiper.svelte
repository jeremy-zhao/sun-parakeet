<script lang="ts" module>
  import './Swiper.css'

  import { untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PageIndicator from './PageIndicator.svelte'

  /** 轮播属性 */
  export interface SwiperAttributes extends HTMLAttributes<EventTarget> {
    /** 当前播放的索引 */
    value?: number
    /** 方向。默认值 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 自动切换 */
    autoplay?: boolean
    /** 自动切换的时间间隔，单位 ms */
    autoplayInterval?: number
    /** 是否循环。子元素数量大于 2 时生效 */
    loop?: boolean
    /** 拖动超出区域时启用回弹效果。仅在非 loop 模式下，且子元素数量大于 1 时生效 */
    bounce?: boolean
    /** 自定义指示器 */
    indicator?: Snippet<[total: number, value: number]>
    /** 切换时触发 */
    onChange?: (value: number) => void
    /** 点击面板时触发 */
    onClick?: (value: number) => void
  }

  const CLICK_THRESHOLD = 2
  const TIME_THRESHOLD = 100
  const VELOCITY_THRESHOLD = 0.5
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    autoplay = false,
    autoplayInterval = 3000,
    bounce = false,
    direction = 'horizontal',
    indicator,
    loop = false,
    onChange,
    onClick,
    class: clazz,
    children,
    ...props
  }: SwiperAttributes = $props()

  let _current = $state(value)

  let _self: HTMLDivElement
  let _track: HTMLDivElement

  let total = $state(0)

  function useTrack(_: HTMLDivElement) {
    total = _track.children.length

    const observer = new MutationObserver(cb => {
      const childList = cb.find(x => x.type === 'childList')
      if (!childList) return
      total = _track.children.length
    })

    observer.observe(_track, { childList: true, subtree: false })

    return {
      destroy() {
        observer.disconnect()
      },
    }
  }

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

  let _pointerId: number | null
  let _start: number
  let _offset = $state(0)

  const vertical = () => direction === 'vertical'

  let translate = $derived(vertical() ? `0px ${_offset}px` : `${_offset}px 0px`)

  const width = () =>
    vertical() ? (_track.children[0]?.clientHeight ?? 0) : (_track.children[0]?.clientWidth ?? 0)

  const min = () => 0 - (total - 1) * width()

  const max = () => 0

  const half = () => Math.floor(total / 2)

  const position = () => Math.floor((-_offset + width() / 2) / width())

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

    if (vertical()) {
      return (_move[j].y - _move[i].y) / dt
    } else {
      return (_move[j].x - _move[i].x) / dt
    }
  }

  function reset() {
    _offset = -_current * width()
    _pointerId = null
    _move = []
  }

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _start = (vertical() ? e.y : e.x) - _offset
    _self.classList.remove('sunp-swiper-animation')

    record(e)
    stop()
  }

  function handlePointerMove(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const offset = (vertical() ? e.y : e.x) - _start

    if (loop && total > 2) {
      _offset = offset
    }
    else if (bounce && !loop && total > 1) {
      _offset =
        offset < min()
          ? min() + (offset - min()) / 8
          : offset > max()
            ? (offset - max()) / 8
            : offset
    }
    else {
      _offset = offset < min() ? min() : offset > max() ? max() : offset
    }

    record(e)
  }

  function handlePointerUp(e: PointerEvent) {
    if (e.pointerId !== _pointerId) return

    const target = e.target as HTMLElement
    target.releasePointerCapture(e.pointerId)

    _pointerId = null
    _self.classList.add('sunp-swiper-animation')

    const offset0 = 0 - width() * value
    const distance = _offset - offset0

    if (Math.abs(distance) < CLICK_THRESHOLD) {
      reset()
      onClick?.(value)
      return
    }

    let next = position()
    const offset = next * width() + _offset
    let sub = offset > 0 ? next - 1 : offset < 0 ? next + 1 : next

    if (!loop) {
      sub = sub < 0 ? 0 : sub >= total ? total - 1 : sub
    }

    record(e)
    const velocity = getVelocity()
    const over = Math.abs(velocity) > VELOCITY_THRESHOLD

    if (velocity < 0 && next < sub && over) {
      next++
    } else if (velocity > 0 && next > sub && over) {
      next--
    }

    if (loop) {
      _current = next
    }

    let cur = next % total
    cur = cur < 0 ? total + cur : cur

    value = cur
    reset()
    play()
  }

  $effect(() => {
    value

    untrack(() => {
      if (loop && total > 2) {
        let cur = _current % total
        cur = cur < 0 ? total + cur : cur

        let diff = value - cur
        diff = diff < -half() ? total + diff : diff > half() ? diff - total : diff

        _current += diff
      }
      else {
        _current = value
      }

      reset()
    })
  })

  $effect(() => {
    if (loop && total > 2) {
      const current = position()

      if (vertical()) {
        _track.style.top = `${(current - half() + ((total + 1) % 2)) * width()}px`
      } else {
        _track.style.left = `${(current - half() + ((total + 1) % 2)) * width()}px`
      }

      untrack(() => {
        for (let i = 0, len = _track.children.length; i < len; i++) {
          const child = _track.children[i] as HTMLElement
          const j = (i - current) % total
          const k = j < 0 ? total + j : j
          const order = k > half() ? k - total : k
          child.style.order = order.toString()
        }
      })
    } else {
      _track.style.removeProperty('left')
      _track.style.removeProperty('top')

      for (let child of _track.children as Iterable<HTMLElement>) {
        child.style.removeProperty('order')
      }
    }
  })
</script>

<div
  bind:this={_self}
  class="sunp-swiper sunp-swiper-{direction} sunp-swiper-animation {clazz}"
  {...props}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={reset}
>
  <div bind:this={_track} use:useTrack class="sunp-swiper__track" style:translate>
    {@render children?.()}
  </div>
  {#if total > 0}
    {#if typeof indicator === 'function'}
      {@render indicator(total, value)}
    {:else}
      <PageIndicator class="sunp-swiper__indicator" {total} {value} {direction} />
    {/if}
  {/if}
</div>
