<script lang="ts" module>
  import './mask.css'
  import './Popup.css'

  import { onMount, untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { get } from 'svelte/store'
  import { delay } from '../common'
  import Layer, { layers, pushLayer, isPopupLayer, type PopupLayer } from './Layer.svelte'

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

  let zIndex = $state(0)
  let renderChildren = $state(visible)
  let closeTimeout: NodeJS.Timeout | undefined

  let _layer = $state<PopupLayer | undefined>()
  let _visible = $derived(!!_layer && !_layer.destroyed)

  function showPopup() {
    renderChildren = true

    const indexes = get(layers)
      .filter(x => isPopupLayer(x))
      .map(x => x.index)

    const index = indexes.length ? Math.max(...indexes) + 1 : 0
    zIndex = 10000 + index

    _layer = { type: 'popup', index }
    pushLayer(_layer)
  }

  function hidePopup() {
    if (!_layer || _layer.destroyed) return

    _layer.destroyed = true
    history.back()

    if (destroyOnClose) {
      closeTimeout = setTimeout(() => (renderChildren = false), 150)
    }
  }

  $effect(() => {
    visible

    untrack(() => {
      if (_visible === visible) return

      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = undefined
      }

      if (visible) {
        showPopup()
      } else {
        hidePopup()
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

<Layer />

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
