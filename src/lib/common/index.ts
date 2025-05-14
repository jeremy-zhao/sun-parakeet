import { browser } from '$app/environment'

/** 等待 n 毫秒 */
export function delay(milliseconds: number = 0): Promise<void> {
  return new Promise<void>(res => {
    setTimeout?.(() => res(), milliseconds) ?? res()
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

export function isWechatDevTools() {
  if (!browser) return false
  const userAgent = navigator.userAgent
  const re = /wechatdevtools/i.test(userAgent)
  return re
}

export function isIOS() {
  if (!browser) return false
  if (isWechatDevTools()) return false
  const userAgent = navigator.userAgent
  const re = /iPhone|iPad|iPod/i.test(userAgent)
  return re
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
