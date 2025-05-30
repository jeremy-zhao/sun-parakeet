import './loading.css'
import LoadingIcon from '../icons/loading.svg?raw'

import { browser } from '$app/environment'
import { type IconOption } from '../common/Icon.svelte'
import { showToast, hideToast, modifyToast, type ShowToastOption } from './Toast.svelte'

export interface ShowLoadingOption {
  /** 更改图标 */
  icon?: string | IconOption
  /** 提示文本 */
  text?: string
}

const key = '__sun_parakeet_loading__'
const defaultIcon = { size: 32, class: 'sunp-loading__icon' }

let _counter = 0

/**
 * 显示 Loading Toast
 * @param option 配置
 * @remark 需要与 `try { ... } final { hideLoading() }` 配对使用
 */
export async function showLoading(option: ShowLoadingOption = {}) {
  if (!browser) return

  if (_counter < 0) _counter = 0
  _counter++

  const { icon, text } = option

  const _option: ShowToastOption = {
    key,
    text,
    icon:
      typeof icon === 'string'
        ? { ...defaultIcon, name: icon }
        : typeof icon === 'object'
          ? icon
          : { ...defaultIcon, svg: LoadingIcon },
    duration: 0,
    mask: true,
    keepOpen: true,
  }

  if (_counter <= 1) {
    await showToast(_option)
  } else {
    modifyToast(_option)
  }
}

/**
 * 关闭 Loading Toast
 * @param force 强制关闭
 */
export function hideLoading(force: boolean = false) {
  if (!browser) return

  if (!force) {
    _counter--
    if (_counter > 0) return
    if (_counter < 0) _counter = 0
  } else {
    _counter = 0
  }

  if (_counter <= 0) {
    hideToast(key)
  }
}
