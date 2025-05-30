<script lang="ts" module>
  import './mask.css'
  import './Toast.css'

  import { onMount } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { delay } from '../common'
  import Layer, { layers, pushLayer, type ToastLayer } from './Layer.svelte'
  import Icon, { type IconOption } from '../common/Icon.svelte'

  /** 轻提示配置 */
  export interface ShowToastOption {
    /** 给 Toast 定义一个 key，调用 hideToast 时，如果 key 不一致，则不会关闭 */
    key?: string
    /** 提示文本 */
    text?: string
    /** 图标 */
    icon?: string | IconOption
    /** 持续时间。默认 1500，0 表示不会自动关闭 */
    duration?: number
    /** 是否显示遮罩 */
    mask?: boolean
    /** 阻止点击关闭，并尝试阻止返回关闭。默认 false */
    keepOpen?: boolean
  }

  /** 轻提示 */
  export type ToastAttributes = Omit<HTMLAttributes<EventTarget>, 'children'>

  let _singleton: HTMLElement | null
  let _mask: HTMLElement | null
  let _toast: HTMLElement | null

  function register(el: HTMLElement) {
    if (!el) throw new Error('[Toast] register(el) el 不能为空')

    if (_singleton) {
      el.remove()
      console.warn('[Toast] Toast 组件只能引用一次，当前引用被忽略')
    } else {
      _singleton = el
      document.body.append(el)

      _mask = el.querySelector<HTMLElement>('.sunp-mask')
      _mask!.addEventListener('click', onClickClose)

      _toast = el.querySelector<HTMLElement>('.sunp-toast')
      _toast!.addEventListener('click', onClickClose)
    }
  }

  function unregister(el: HTMLElement) {
    if (!el) throw new Error('[Toast] unregister(el) el 不能为空')
    if (el !== _singleton) return

    _mask = null
    _toast = null
    _singleton.remove()
  }

  let _option = $state<ShowToastOption | undefined>()
  let _timer: NodeJS.Timeout | undefined
  let _layer: ToastLayer | undefined

  function onClickClose() {
    if (!_option || _option.keepOpen) return
    hideToast(_option.key)
  }

  function show() {
    _layer = { type: 'toast', keepOpen: !!_option!.keepOpen }
    pushLayer(_layer)
  }

  /**
   * 显示轻提示
   * @param option 轻提示配置
   */
  export async function showToast(option: ShowToastOption) {
    if (!_singleton) {
      console.error('[SunParakeet:Toast]', '未引用 Toast 组件')
      return
    }

    const { key, text, icon, duration = 1500 } = option

    if (key && key === _option?.key && key !== '__sun_parakeet_loading__') return

    if (!text && !icon) {
      console.warn('[SunParakeet:Toast]', '至少指定 text 和 icon 中的一个')
      return
    }

    await _hideToast()
    _option = { ...option, duration }
    show()

    if (_timer) {
      clearTimeout(_timer)
      _timer = undefined
    }

    if (duration > 0) {
      _timer = setTimeout(() => hideToast(), duration)
    }
  }

  async function _hideToast() {
    if (!_layer || _layer.destroyed) return

    if (_timer) {
      clearTimeout(_timer)
      _timer = undefined
    }

    _layer.destroyed = true
    history.back()
    await delay(150)
    _option = undefined
  }

  /**
   * 关闭轻提示
   * @param key 如果提供 key，则会与 showToast 提供的 key 匹配，如果不一致则不会关闭
   */
  export function hideToast(key?: string) {
    if (!_toast || (key && key !== _option?.key)) return

    _hideToast()
  }

  /**
   * 修改当前轻提示的内容
   * @param option 轻提示配置
   */
  export function modifyToast(option: Pick<ShowToastOption, 'key' | 'icon' | 'text'>) {
    if (!_option) return

    if (option.key && _option.key !== option.key) return

    const { text, icon } = option
    _option = { ..._option, text: text ?? _option.text, icon: icon ?? _option.icon }
  }
</script>

<script lang="ts">
  let _self: HTMLDivElement

  let { class: clazz, ...props }: ToastAttributes = $props()

  let visible = $state(false)
  let cursor = $derived(_option && _option.duration && !_option.keepOpen ? 'pointer' : 'default')

  layers.subscribe(cb => {
    visible = !!_layer && !_layer.destroyed
  })

  onMount(() => {
    register(_self)
    return () => unregister(_self)
  })
</script>

<Layer />

<div bind:this={_self} class="sunp-toast-wrapper" style:cursor>
  <div class="sunp-mask" class:sunp-mask-visible={visible && _option?.mask}></div>
  <div class="sunp-toast {clazz}" class:sunp-toast-visible={visible} {...props}>
    {#if _option?.icon}
      {#if typeof _option.icon === 'string'}
        <Icon name={_option.icon} size={32} />
      {:else if typeof _option.icon === 'object'}
        <Icon {..._option.icon} />
      {/if}
    {/if}
    {#if _option?.text}
      <pre class="sunp-toast__pre">{_option.text}</pre>
    {/if}
  </div>
</div>
