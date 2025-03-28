<script lang="ts" module>
  import './mask.css'
  import './Popup.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

  export interface PopupAttributes extends HTMLAttributes<EventTarget> {
    /** 是否显示 */
    visible?: boolean
    /** 弹出位置。默认为 `bottom` */
    position?: PopupPosition
    /** 是否展示遮罩。默认为 `true` */
    mask?: boolean
    /** 点击遮罩时是否关闭。默认为 `true` */
    maskClickClose?: boolean
    /** 点击遮罩关闭时触发 */
    onClose?: () => void
  }
</script>

<script lang="ts">
  import { browser } from '$app/environment'
  import stack from '../common/historyStack.js'
  import { onMount } from 'svelte'

  let _mask: HTMLDivElement
  let _self: HTMLDivElement

  let {
    visible = $bindable(false),
    position = 'bottom',
    mask = true,
    maskClickClose = true,
    class: clazz,
    onClose,
    children,
    ...props
  }: PopupAttributes = $props()

  let zIndex = $derived(10000 + 2 * stack.indexOf(_self!))

  let positioned = $derived(`sun-parakeet-popup-${position}`)

  // visible
  $effect(() => {
    if (!browser) return

    if (visible && stack.indexOf(_self) < 0) {
      mask && document.body.append(_mask)

      stack.push({
        key: _self,
        historyBack(item) {
          if (item.key !== _self) return
          visible = false
        },
      })
    } else if (!visible && stack.indexOf(_self) >= 0) {
      stack.remove(_self)
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
  class="sun-parakeet-mask"
  style:visibility={visible ? 'visible' : 'hidden'}
  style:z-index={zIndex}
  onclick={handleClickMask}
></div>

<div
  bind:this={_self}
  class="sun-parakeet-popup {positioned} {clazz}"
  class:visible
  {...props}
  style:z-index={zIndex + 1}
>
  {@render children?.()}
</div>
