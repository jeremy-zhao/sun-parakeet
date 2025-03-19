import './loading.css'

import { browser } from '$app/environment'
import { showToast, hideToast } from './toast'

export interface ShowLoadingOption {
  /** 提示文本 */
  text?: string
}

const key = '__loading__'

let _counter = 0

/**
 * 显示 Loading Toast
 * @remark 需要与 `try { ... } final { hideLoading() }` 配对使用
 */
export async function showLoading(option: ShowLoadingOption = {}) {
  if (!browser) return

  if (_counter < 0) _counter = 0
  _counter++

  const { text } = option

  await showToast({
    key,
    text,
    icon: { name: 'loading', size: 32, class: 'sun-parakeet-loading__icon' },
    duration: 0,
    mask: true,
    keep: true,
  })
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
