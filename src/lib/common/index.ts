import { browser } from '$app/environment'

// 等待 n 毫秒
export function delay(milliseconds: number = 0) {
  if (!browser) return

  return new Promise<void>(res => {
    setTimeout(() => res(), milliseconds)
  })
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
