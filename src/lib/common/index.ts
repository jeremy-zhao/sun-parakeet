import { browser } from '$app/environment'

// 等待 n 毫秒
export function delay(milliseconds: number = 0) {
  if (!browser) return

  return new Promise<void>(res => {
    setTimeout(() => res(), milliseconds)
  })
}
