<script lang="ts" module>
  import './Swiper.css'

  import PageIndicator from './PageIndicator.svelte'
  import type { HTMLAttributes } from 'svelte/elements'

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
  }

  // 滑动时判定状态变更的最小位移
  const THRESHOLD = 20
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    autoplay = false,
    autoplayInterval = 3000,
    direction = 'horizontal',
    loop = false,
    onChange,
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

  // 触摸控制 =================================

  let _pointerId: number | null | undefined
  let _start: number
  let _offset = $state(0)

  let translate = $derived(`${_offset}px 0px`)

  const min = () => 0 - (total - 1) * _self.clientWidth
  const max = () => 0

  function reset() {
    _offset = 0 - value * _self.clientWidth
    _pointerId = null
  }

  function handlePointerDown(e: PointerEvent) {
    if (_pointerId) return

    // console.log('[SwipAction]', 'handlePointerDown', e.x)
    const target = e.target as HTMLElement
    target.setPointerCapture(e.pointerId)

    _pointerId = e.pointerId
    _start = e.x - _offset
    _self.classList.remove('sun-parakeet-swiper-animation')
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
    _self.classList.add('sun-parakeet-swiper-animation')

    // 点击关闭

    // if (
    //   (_state === 'left' && _offset >= max() - 1) ||
    //   (_state === 'right' && _offset <= min() + 1)
    // ) {
    //   // 手动归位
    //   if (keepOnAction && e.composedPath().find(x => x === _left || x === _right)) return

    //   // 自动归位
    //   _state = 'close'
    //   return
    // }

    // 滑动
    let next = Math.floor((0 - _offset + _self.clientWidth / 2) / _self.clientWidth)

    if (next === value) {
      const thresholdMin = 0 - _self.clientWidth * next - THRESHOLD
      const thresholdMax = 0 - _self.clientWidth * next + THRESHOLD

      next = _offset < thresholdMin ? next + 1 : _offset > thresholdMax ? next - 1 : next
    }

    next = next < 0 ? 0 : next >= total ? total - 1 : next

    value = next
    reset()
  }
</script>

<div
  bind:this={_self}
  class={[
    'sun-parakeet-swiper',
    `sun-parakeet-swiper-${direction}`,
    'sun-parakeet-swiper-action-animation',
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
