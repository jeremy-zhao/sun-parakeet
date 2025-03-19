import './mask.css'
import './toast.css'

import { browser } from '$app/environment'
import { on } from 'svelte/events'
import { delay } from '../common'
import stack from '../common/historyStack'
import type { IconOption } from '../common/Icon.svelte'

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
  /** 阻止点击关闭。默认 true */
  keep?: boolean
}

const svgns = 'http://www.w3.org/2000/svg'

let _option: ShowToastOption | undefined

let _mask: HTMLDivElement | undefined
let _toast: HTMLDivElement | undefined
let _icon: SVGSVGElement | undefined
let _pre: HTMLPreElement | undefined
let _timer: NodeJS.Timeout | undefined

function isString(icon?: string | IconOption): icon is string {
  return typeof icon === 'string'
}

function isIconOption(icon?: string | IconOption): icon is IconOption {
  return typeof icon === 'object'
}

/** 显示轻提示 */
export async function showToast(option: ShowToastOption) {
  if (!browser) return

  const { key, text, icon, duration = 1500, mask, keep } = option
  const current = _option

  // 同一个 key 不会重复执行
  if (key && key === current?.key && key !== '__loading__') return

  if (!text && !icon) {
    console.warn('至少指定 text 和 icon 中的一个')
    return
  }

  if (mask && !_mask) {
    _mask = document.createElement('div')
    _mask.className = 'sp-mask'

    on(_mask, 'click', () => !_option?.keep && hideToast())
  }

  if (!_toast) {
    _toast = document.createElement('div')
    _toast.classList.add('sun-parakeet-toast')

    on(_toast, 'click', () => !_option?.keep && hideToast())

    document.body.appendChild(_toast)
  }

  if (!_icon) {
    _icon = document.createElementNS(svgns, 'svg')
    const use = document.createElementNS(svgns, 'use')
    _icon.appendChild(use)
  }

  if (!_pre) {
    _pre = document.createElement('pre')
    _pre.className = 'sun-parakeet-toast__pre'
  }

  const toasting = !!_option

  _hideToast()
  _option = { key, text, icon, duration, mask, keep }

  if (mask) {
    document.body.append(_mask!)
  } else if (_mask) {
    _mask.remove()
  }

  if (toasting) {
    await delay(150)
  } else {
    stack.push({
      key: _toast,
      historyBack: !keep
        ? item => {
            console.log('toast historyBack')
            if (item.key !== _toast) return
            _hideToast()
          }
        : undefined,
    })
  }

  if (isString(icon)) {
    _icon.setAttributeNS(null, 'width', '24')
    _icon.setAttributeNS(null, 'height', '24')
    _icon.setAttributeNS(null, 'class', 'stroke-white')
    _icon.children[0]!.setAttributeNS(null, 'href', `/icons/symbol.svg#${icon}`)

    if (_toast.children[0] !== _icon) {
      _toast.prepend(_icon)
    }
  } else if (isIconOption(icon)) {
    const { name, size = 24, path = '/icons/symbol.svg', class: className = '', style = '' } = icon as IconOption

    _icon.setAttributeNS(null, 'width', size.toString())
    _icon.setAttributeNS(null, 'height', size.toString())
    _icon.setAttributeNS(null, 'class', className)
    _icon.setAttributeNS(null, 'style', style)
    _icon.style.top = `${top}px`
    _icon.children[0]!.setAttributeNS(null, 'href', `${path}#${name}`)

    if (_toast.children[0] !== _icon) {
      _toast.prepend(_icon)
    }
  } else {
    _icon.remove()
  }

  if (text) {
    _pre.innerText = text

    if (!_toast.children.length || _toast.children[_toast.children.length - 1] != _pre) {
      _toast.append(_pre)
    }
  } else {
    _pre.remove()
  }

  await delay()

  if (_timer) {
    clearTimeout(_timer)
    _timer = undefined
  }

  if (duration > 0) {
    _timer = setTimeout(() => hideToast(), duration)
  }

  _toast.classList.add('scale-100', 'visible')
}

async function _hideToast() {
  if (!_toast) return

  if (_timer) {
    clearTimeout(_timer)
    _timer = undefined
  }

  if (_mask) {
    _mask.remove()
  }

  _option = undefined

  _toast.classList.remove('scale-100')

  await delay(150)

  if (_option) return
  _toast.classList.remove('visible')
}

/**
 * 关闭轻提示
 * @param key 如果提供 key，则会与 showToast 提供的 key 匹配，如果不一致则不会关闭
 */
export function hideToast(key?: string) {
  if (!browser) return
  if (!_toast) return
  if (key && key !== _option?.key) return

  _hideToast()
  stack.remove(_toast)
}
