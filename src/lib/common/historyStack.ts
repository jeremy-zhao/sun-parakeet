import { browser } from '$app/environment'
import { pushState } from '$app/navigation'
import { get, writable } from 'svelte/store'
import { on } from 'svelte/events'

export interface SvelteHistoryState {
  'sveltekit:history'?: number
  'sveltekit:navigation'?: number
  'sveltekit:pageurl'?: string
  'sveltekit:states'?: unknown
}

export interface StackItem {
  /** 键 */
  key?: unknown

  /**
   * 浏览器返回事件的回调函数
   * @returns 返回值为 true 表示需要阻止浏览器返回
   * @remark 若不提供此回调函数，则会默认阻止浏览器返回事件
   */
  historyBack?: (item: StackItem) => boolean | void
}

/** 页面切换方向 */
export type PageSwitch =
  /** 前进 */
  | 'forward'
  /** 后退 */
  | 'backward'

type StackItemInternal = StackItem & {
  history: number
  navigation: number
  stacked: boolean
  removed: boolean
}

/** 打栈条目日志 */
function logStack(msg: string, items: StackItemInternal[]) {
  console.group(`[STACK] ${msg} ${location.href}`)

  for (const item of items) {
    console.log(
      'history:',
      item.history,
      'navigation:',
      item.navigation,
      'stacked:',
      item.stacked,
      'removed:',
      item.removed,
      'historyBack',
      typeof item.historyBack
    )
  }

  console.groupEnd()
}

// 劫持 ==============================================================================================

const _stack = writable<StackItemInternal[]>([])
// const _poped = writable<StackItemInternal[]>([])
const _lastPage = writable<number>(0)

// 劫持 history.pushState
const _pushState = browser ? history.pushState : undefined

// 劫持 pushState
function pushStateHijacked(data: SvelteHistoryState, unused: string, url?: string | URL | null) {
  if (!browser || !_pushState) return

  const stack = get(_stack)

  const s0: StackItemInternal = {
    history: history.state['sveltekit:history'],
    navigation: history.state['sveltekit:navigation'],
    stacked: false,
    removed: false,
  }

  if (!stack.length || !stack.find(x => x.history === s0.history)) {
    stack.push(s0)
  }

  _pushState.call(history, data, unused, url)

  const sT: StackItemInternal = {
    history: history.state['sveltekit:history'],
    navigation: history.state['sveltekit:navigation'],
    stacked: history.state['sveltekit:navigation'] === s0.navigation,
    removed: false,
  }

  stack.push(sT)
  logStack('push state', stack)

  _stack.set(stack)

  if (sT.navigation !== s0.navigation) {
    _lastPage.set(s0.navigation)
  }

  if (sT.stacked) return

  // 翻页时，未关闭的栈帧重入
  const repush = stack.filter(x => x.navigation === s0.navigation && x.stacked && !x.removed)
  if (!repush?.length) return

  logStack('repush', repush)

  setTimeout(() => {
    for (const item of repush) {
      item.removed = true
      const { key, historyBack } = item
      push({ key, historyBack })
    }
  }, 0)
}

// popstate 事件
function onPopState(event: PopStateEvent) {
  if (!browser || event.type !== 'popstate') return

  const hT = event.state['sveltekit:history']
  const nT = event.state['sveltekit:navigation']
  let n0: number | undefined = undefined

  const stackT: StackItemInternal[] = []
  const popedT: StackItemInternal[] = []
  const prevents: StackItemInternal[] = []

  const stack0 = get(_stack)

  for (let i = stack0.length - 1; i >= 0; i--) {
    const item = stack0[i]

    if (!n0) {
      n0 = item.navigation
    }

    if (item.history > hT) {
      // 未提供 historyBack 回调，或者回调返回 true，阻止 history back
      const prevent = item.stacked && !item.removed && (!item.historyBack || !!item.historyBack(item))

      // 未受阻止，移除
      if (!prevent) {
        popedT.push(item)
      }
      // 阻止
      else {
        prevents.unshift(item)
      }
    } else {
      stackT.unshift(item)
    }
  }

  logStack('pop stack', stackT)
  logStack('pop poped', popedT)

  _stack.set(stackT)
  // _poped.set(popedT)

  if (n0 && n0 !== nT) {
    _lastPage.set(n0)
  }

  // 被阻止回复
  if (prevents.length) {
    logStack('pop prevents', prevents)

    for (const item of prevents) {
      const { key, historyBack } = item
      push({ key, historyBack })
    }

    return
  }

  // 移除已清除的状态
  let removes = 0

  for (let i = stackT.length - 1; i >= 0; i--) {
    const item = stackT[i]
    if (!item.removed) break
    removes++
  }

  if (removes > 0) {
    setTimeout(() => {
      history.go(-removes)
      console.log('[STACK]', 'removes', removes)
    }, 100)
  }
}

if (browser) {
  history.pushState = pushStateHijacked
  on(window, 'popstate', onPopState)
}

// 方法 ==============================================================================================

/** 压栈 */
function push(item: StackItem) {
  if (!browser) return

  pushState(location.href + '#', '__stack__')
  // pushState(location.href, '__stack__')

  _stack.update(x => {
    const current = x.pop()!
    return [...x, { ...current, ...item }]
  })
}

/** 移除 */
function remove(key: unknown) {
  const stack0 = get(_stack)

  const stackT = stack0.map(x => {
    const { history, navigation, stacked } = x
    return x.key === key ? { history, navigation, stacked, removed: true } : x
  })

  _stack.set(stackT)

  const top = stack0[stack0.length - 1]

  if (top && key === top.key) {
    history.back()
  }
}

/** 获取栈索引 */
function indexOf(key: unknown) {
  const stack = get(_stack)
  const re = stack.findIndex(x => x.key === key && !x.removed)
  return re
}

/** 获取页面切换方向 */
function pageSwitch(): PageSwitch {
  const p0 = get(_lastPage)
  const stack = get(_stack)
  const pT = stack[stack.length - 1].navigation
  return pT > p0 ? 'forward' : 'backward'
}

export default {
  push,
  remove,
  indexOf,
  pageSwitch,
}
