<script lang="ts" module>
  import './mask.css'
  import './Popup.css'

  import { pushState } from '$app/navigation'
  import { page } from '$app/state'
  import { onMount, untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { delay } from '../common'

  /** 弹出层位置 */
  export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

  /** 弹出层 */
  export interface PopupAttributes extends HTMLAttributes<EventTarget> {
    /** 是否显示 */
    visible?: boolean
    /** 弹出位置。默认为 `bottom` */
    position?: PopupPosition
    /** 不展示遮罩 */
    noMask?: boolean
    /** 阻止点击遮罩关闭 */
    keepOpenOnClickMask?: boolean
    /** 关闭时销毁子元素 */
    destroyOnClose?: boolean
    /** 关闭时触发 */
    onClose?: () => void
  }

  declare global {
    namespace App {
      interface PageState {
        __sun_parakeet_popup__?: number[]
      }
    }
  }

  let _layer = 0
</script>

<script lang="ts">
  let _self: HTMLDivElement

  let {
    visible = $bindable(false),
    destroyOnClose = false,
    keepOpenOnClickMask = false,
    noMask = false,
    position = 'bottom',
    onClose,
    children,
    class: clazz,
    ...props
  }: PopupAttributes = $props()

  let index = -1
  let zIndex = $state(0)
  let renderChildren = $state(visible)
  let closeTimeout: NodeJS.Timeout | undefined

  let _visible = $derived.by(() => {
    const opening = page.state.__sun_parakeet_popup__
    const re = !!(opening && opening.indexOf(index) >= 0)
    return re
  })

  $effect(() => {
    visible

    untrack(() => {
      if (_visible === visible) return

      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = undefined
      }

      if (visible) {
        renderChildren = true
        index = _layer
        zIndex = 10000 + _layer++

        const opening = new Set(page.state.__sun_parakeet_popup__)
        opening.add(index)
        pushState('', { __sun_parakeet_popup__: [...opening] })
      } else {
        _layer--
        index = -1
        history.back()

        if (destroyOnClose) {
          closeTimeout = setTimeout(() => (renderChildren = false), 150)
        }
      }
    })
  })

  function handleClickMask(e: MouseEvent) {
    e.stopPropagation()
    if (keepOpenOnClickMask) return
    visible = false
    onClose?.()
  }

  async function handleHistoryBack() {
    if (!visible) return
    await delay()
    if (_visible) return

    visible = false
    onClose?.()
  }

  onMount(() => {
    document.body.append(_self)
    window.addEventListener('popstate', handleHistoryBack)

    return () => {
      _self.remove()
      window.removeEventListener('popstate', handleHistoryBack)
    }
  })
</script>

<div bind:this={_self} class="sunp-popup-wrapper" style:z-index={zIndex}>
  <div
    class="sunp-mask"
    class:sunp-mask-visible={!noMask && _visible}
    onclick={handleClickMask}
  ></div>

  <div
    class="sunp-popup sunp-popup-{position} {clazz}"
    class:sunp-popup-visible={_visible}
    {...props}
  >
    {#if renderChildren}
      {@render children?.()}
    {/if}
  </div>
</div>
