<script lang="ts" module>
  import './Swiper.css'

  import { untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PageIndicator from './PageIndicator.svelte'

  /** 轮播属性 */
  export interface SwiperAttributes extends HTMLAttributes<EventTarget> {
    /** 自动切换 */
    autoplay?: boolean
    /** 自动切换的时间间隔，单位 ms */
    autoplayInterval?: number
    /** 拖动超出区域时启用回弹效果。仅在非 loop 模式下，且子元素数量大于 1 时生效 */
    bounce?: boolean
    /** 方向。默认值 'horizontal' */
    direction?: 'horizontal' | 'vertical'
    /** 是否循环。子元素数量大于 2 时生效 */
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
    bounce = false,
    direction = 'horizontal',
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

  // 总数变更 =================================

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

  // 记录移动数据
  function record(e: PointerEvent) {
    _move.push({ x: e.x, y: e.y, t: Date.now() })
  }

  // 获取速度
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

  // 根据位移计算当前位置
  function calcPosition() {
    const current = Math.floor((-_offset + _self.clientWidth / 2) / _self.clientWidth)
    const offset = current * _self.clientWidth + _offset
    return [current, offset]
  }

  // 重置
  function reset() {
    _offset = -_current * _self.clientWidth
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

    // 轮播
    if (loop && total > 2) {
      _offset = offset
    }
    // 弹性
    else if (bounce && !loop && total > 1) {
      _offset =
        offset < min()
          ? min() + (offset - min()) / 8
          : offset > max()
            ? (offset - max()) / 8
            : offset
    }
    // 普通
    else {
      _offset = offset < min() ? min() : offset > max() ? max() : offset
    }

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
    let [next, offset] = calcPosition()
    let sub = offset > 0 ? next - 1 : offset < 0 ? next + 1 : next

    if (!loop) {
      sub = sub < 0 ? 0 : sub >= total ? total - 1 : sub
    }

    console.log('next', next, 'sub', sub)

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
      // 循环播放，值被外部改变时，就近取值
      if (loop && total > 2) {
        const half = Math.floor(total / 2)
        let cur = _current % total
        cur = cur < 0 ? total + cur : cur

        let diff = value - cur
        diff = diff < -half ? total + diff : diff > half ? diff - total : diff

        _current += diff
      }
      // 非循环播放
      else {
        _current = value
      }

      reset()
    })
  })

  $effect(() => {
    if (loop && total > 2) {
      _offset

      const half = Math.floor(total / 2)

      const [current, _] = calcPosition()
      _track.style.left = `${(current - half + ((total + 1) % 2)) * _self.clientWidth}px`

      untrack(() => {
        const half = Math.floor(total / 2)

        for (let i = 0, len = _track.children.length; i < len; i++) {
          const child = _track.children[i] as HTMLElement
          const j = (i - current) % total
          const k = j < 0 ? total + j : j
          const l = k > half ? k - total : k
          child.style.order = l.toString()
        }
      })
    }
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
  <div bind:this={_track} use:useTrack class="sun-parakeet-swiper__track" style:translate>
    {@render children?.()}
  </div>
  <PageIndicator class="sun-parakeet-swiper__indicator" {total} {value} />
</div>
