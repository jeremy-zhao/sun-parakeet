<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export type PopupPosition = 'center' | 'top' | 'right' | 'bottom' | 'left'

  export interface PopupAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 是否显示 */
    visible: boolean
    /** 弹出位置。默认为 `bottom` */
    position?: PopupPosition
    /** 是否展示遮罩。默认为 `true` */
    mask?: boolean
    /** 点击遮罩时是否关闭。默认为 `true` */
    maskClickClose?: boolean
    /** 点击遮罩关闭时触发 */
    onclose?: () => void
  }

  const positions = {
    center: {
      clazz: ['top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2'],
      visible: 'scale-100',
      hidden: 'scale-0',
    },
    top: {
      clazz: ['top-0', 'right-0', 'left-0', 'pt-safe'],
      visible: 'translate-y-0',
      hidden: '-translate-y-full',
    },
    right: {
      clazz: ['top-0', 'right-0', 'bottom-0', 'pr-safe'],
      visible: 'translate-x-0',
      hidden: 'translate-x-full',
    },
    bottom: {
      clazz: ['right-0', 'left-0', 'bottom-0', 'pb-safe'],
      visible: 'translate-y-0',
      hidden: 'translate-y-full',
    },
    left: {
      clazz: ['top-0', 'left-0', 'bottom-0', 'pl-safe'],
      visible: 'translate-x-0',
      hidden: '-translate-x-full',
    },
  }
</script>

<script lang="ts">
  import { browser } from '$app/environment'
  import stack from '../common/historyStack.js'
  import { onDestroy, onMount } from 'svelte'

  let _mask: HTMLDivElement
  let _self: HTMLDivElement

  let {
    visible = $bindable(),
    position = 'bottom',
    mask = true,
    maskClickClose = true,
    class: clazz,
    onclose,
    children,
    ...native
  }: PopupAttributes = $props()

  let zIndex = $derived(10000 + 2 * stack.indexOf(_self!))

  let positioned = $derived(`sp-popup-${position}`)

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
    setTimeout(() => onclose?.(), 20)
  }

  onMount(() => {
    if (!browser) return
    document.body.append(_self)
  })

  onDestroy(() => {
    if (!browser) return
    _self.remove()
  })
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={_mask}
  class="sp-mask"
  style:visibility={visible ? 'visible' : 'hidden'}
  style:z-index={zIndex}
  onclick={handleClickMask}
></div>

<div bind:this={_self} class="sp-popup {positioned} {clazz}" class:visible {...native} style:z-index={zIndex + 1}>
  {@render children?.()}
</div>

<style lang="postcss">
  .sp-mask {
    @apply fixed bottom-0 left-0 right-0 top-0 bg-black/20;
  }

  .sp-popup {
    @apply fixed bg-white transition-transform;

    &.sp-popup-center {
      @apply left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-0;

      &.visible {
        @apply scale-100;
      }
    }

    &.sp-popup-top {
      @apply left-0 right-0 top-0 -translate-y-full pt-safe;

      &.visible {
        @apply translate-y-0;
      }
    }

    &.sp-popup-right {
      @apply bottom-0 right-0 top-0 translate-x-full pr-safe;

      &.visible {
        @apply translate-x-0;
      }
    }

    &.sp-popup-bottom {
      @apply bottom-0 left-0 right-0 translate-y-full pb-safe;

      &.visible {
        @apply translate-y-0;
      }
    }

    &.sp-popup-left {
      @apply bottom-0 left-0 top-0 -translate-x-full pl-safe;

      &.visible {
        @apply translate-x-0;
      }
    }
  }
</style>
