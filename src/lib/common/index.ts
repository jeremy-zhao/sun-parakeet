import { browser } from '$app/environment'

// 等待 n 毫秒
export function delay(milliseconds: number = 0): void | Promise<void> {
  if (!browser) return

  return new Promise<void>(res => {
    setTimeout(() => res(), milliseconds)
  })
}

/** 定义非空类型 */
export type NonEmptyValue<T> = T extends null | undefined | '' ? never : T

/** 判断值不是 null, undefined, '' */
export function isNonEmpty<T>(value: T): value is NonEmptyValue<T> {
  if (value === null || value === undefined || value === '') return false
  if (typeof value === 'number' && isNaN(value)) return false
  return true
}

// 判断客户端是否为微信开发者工具
export function isWechatDevTools() {
  if (!browser) return false
  const userAgent = navigator.userAgent
  const re = /wechatdevtools/i.test(userAgent)
  return re
}

// 判断客户端是否为 IOS
export function isIOS() {
  if (!browser) return false
  if (isWechatDevTools()) return false
  const userAgent = navigator.userAgent
  const re = /iPhone|iPad|iPod/i.test(userAgent)
  return re
}
