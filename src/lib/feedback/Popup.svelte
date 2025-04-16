<script lang="ts" module>
  import './mask.css'
  import './Popup.css'

  import { onMount } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import stack from '../common/historyStack.js'

  export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

  export interface PopupAttributes extends HTMLAttributes<EventTarget> {
    /** 关闭时销毁子元素 */
    destroyOnClose?: boolean
    /** 是否展示遮罩。默认为 `true` */
    mask?: boolean
    /** 点击遮罩时是否关闭。默认为 `true` */
    maskClickClose?: boolean
    /** 弹出位置。默认为 `bottom` */
    position?: PopupPosition
    /** 是否显示 */
    visible?: boolean
    /** 点击遮罩关闭时触发 */
    onClose?: () => void
  }
</script>

<script lang="ts">
  let _mask: HTMLDivElement
  let _self: HTMLDivElement

  let {
    visible = $bindable(false),
    destroyOnClose = false,
    mask = true,
    maskClickClose = true,
    position = 'bottom',
    class: clazz,
    onClose,
    children,
    ...props
  }: PopupAttributes = $props()

  let zIndex = $derived(10000 + 2 * stack.indexOf(_self!))
  let positioned = $derived(`sunp-popup-${position}`)
  let renderChildren = $state(true)
  let closeTimeout: NodeJS.Timeout | undefined

  // visible
  $effect(() => {
    if (closeTimeout) {
      clearTimeout(closeTimeout)
      closeTimeout = undefined
    }

    if (visible) {
      mask && document.body.append(_mask)
      renderChildren = true

      if (stack.indexOf(_self) < 0) {
        stack.push({
          key: _self,
          historyBack(item) {
            if (item.key !== _self) return
            visible = false
          },
        })
      }
    } else if (!visible) {
      if (stack.indexOf(_self) >= 0) {
        stack.remove(_self)
      }

      if (destroyOnClose) {
        closeTimeout = setTimeout(() => (renderChildren = false), 150)
      }
    }
  })

  function handleClickMask() {
    if (!maskClickClose) return
    visible = false
    setTimeout(() => onClose?.(), 20)
  }

  onMount(() => {
    document.body.append(_self)

    return () => {
      _self.remove()
    }
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={_mask}
  class="sunp-mask"
  style:visibility={visible ? 'visible' : 'hidden'}
  style:z-index={zIndex}
  onclick={handleClickMask}
></div>

<div
  bind:this={_self}
  class="sunp-popup {positioned} {clazz}"
  class:sunp-popup-visible={visible}
  {...props}
  style:z-index={zIndex + 1}
>
  {#if renderChildren}
    {@render children?.()}
  {/if}
</div>
