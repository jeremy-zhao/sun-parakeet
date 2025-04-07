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

/** 浏览器历史栈帧 */
export interface StackFrame {
  /** 键 */
  key?: unknown

  /**
   * 浏览器返回事件的回调函数
   * @returns 返回值为 true 表示需要阻止浏览器返回
   * @remark 若不提供此回调函数，则会默认阻止浏览器返回事件
   */
  historyBack?: (item: StackFrame) => boolean | void
}

/** 页面切换方向 */
export type PageSwitch =
  /** 前进 */
  | 'forward'
  /** 后退 */
  | 'backward'
  /** 加载/重新加载 */
  | 'load'

/** 浏览器历史栈帧，内部值 */
type StackFrameInternal = StackFrame & {
  /** 历史计数。SvelteKit 提供 */
  history: number
  /** 页面计数。SvelteKit 提供 */
  navigation: number
  /** 虚拟栈帧 */
  virtual: boolean
  /** 移除标记 */
  removed: boolean
}

/** 打栈条目日志 */
function logStack(msg: string, items: StackFrameInternal[]) {
  console.group(`[STACK] ${msg} ${location.href}`)

  for (const item of items) {
    console.log(
      'history:',
      item.history,
      'navigation:',
      item.navigation,
      'virtual:',
      item.virtual,
      'removed:',
      item.removed,
      'historyBack',
      typeof item.historyBack
    )
  }

  console.groupEnd()
}

// 劫持 ==============================================================================================

const _stack = writable<StackFrameInternal[]>([])
// const _poped = writable<StackFrameInternal[]>([])
const _lastPage = writable<number>(0)

// 劫持 history.pushState
const _pushState = browser ? history.pushState : undefined

// 劫持 pushState
function pushStateHijacked(data: SvelteHistoryState, unused: string, url?: string | URL | null) {
  if (!browser || !_pushState) return

  // 压栈前 ====

  const stack = get(_stack)

  const s0: StackFrameInternal = {
    history: history.state['sveltekit:history'],
    navigation: history.state['sveltekit:navigation'],
    virtual: false,
    removed: false,
  }

  // 补第一页的压栈信息
  if (!stack.length || !stack.find(x => x.history === s0.history)) {
    stack.push(s0)
  }

  // 压栈
  _pushState.call(history, data, unused, url)

  // 压栈后 ====
  const sT: StackFrameInternal = {
    history: history.state['sveltekit:history'],
    navigation: history.state['sveltekit:navigation'],
    virtual: history.state['sveltekit:navigation'] === s0.navigation, // 通过页面计数，确定当前是否为虚拟栈帧
    removed: false,
  }

  stack.push(sT)
  logStack('push state', stack)

  _stack.set(stack)

  if (sT.virtual) return

  // 暂存上一页的计数
  _lastPage.set(s0.navigation)

  // 翻页时，未关闭的栈帧重入
  const repush = stack.filter(x => x.navigation === s0.navigation && x.virtual && !x.removed)
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

  const stackT: StackFrameInternal[] = []
  const popedT: StackFrameInternal[] = []
  const prevents: StackFrameInternal[] = []

  const stack0 = get(_stack)

  for (let i = stack0.length - 1; i >= 0; i--) {
    const item = stack0[i]

    if (!n0) {
      n0 = item.navigation
    }

    if (item.history > hT) {
      // 未提供 historyBack 回调，或者回调返回 true，阻止 history back
      const prevent =
        item.virtual && !item.removed && (!item.historyBack || !!item.historyBack(item))

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

// 首次加载 ==========================================================================================

const LAST_PAGE = '__sun_parakeet_last_page__'
const STACK = '__sun_parakeet_stack__'

// 页面离开或刷新时，暂存当前状态
function setTemp() {
  const lastPage = get(_lastPage)

  if (lastPage) {
    sessionStorage.setItem(LAST_PAGE, lastPage.toString())
  }

  const stack = get(_stack)

  if (stack?.length) {
    sessionStorage.setItem(STACK, JSON.stringify(stack))
  }
}

// 重新载入时恢复状态
function loadTemp() {
  const lastPage = sessionStorage.getItem(LAST_PAGE)

  if (lastPage) {
    try {
      _lastPage.set(parseInt(lastPage))
    } catch {
      console.log('[STACK]', 'Error on reload lastPage', lastPage)
    }
  }

  const stackJson = sessionStorage.getItem(STACK)

  if (stackJson?.length) {
    try {
      const stack = JSON.parse(stackJson)

      // 移除当前页的虚拟栈帧
      for (let i = stack.length - 1; i >= 0; i--) {
        if (!stack[i].virtual) break
        stack.pop()
      }

      _stack.set(stack)
    } catch {
      console.log('[STACK]', 'Error on reload stack', stackJson)
    }
  }
}

if (browser) {
  window.addEventListener('pagehide', setTemp)
  loadTemp()
}

// 方法 ==============================================================================================

/** 压栈 */
function push(item: StackFrame) {
  if (!browser) return

  // pushState(location.href + '#', '__stack__')
  pushState(location.href, '__stack__')

  _stack.update(x => {
    const current = x.pop()!
    return [...x, { ...current, ...item }]
  })
}

/** 移除 */
function remove(key: unknown) {
  const stack0 = get(_stack)

  const stackT = stack0.map(x => {
    const { history, navigation, virtual } = x
    return x.key === key ? { history, navigation, virtual, removed: true } : x
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
  const stack = get(_stack)
  if (!stack.length) return 'load'

  const p0 = get(_lastPage)
  const pT = stack[stack.length - 1].navigation
  return pT > p0 ? 'forward' : pT < p0 ? 'backward' : 'load'
}

export default {
  push,
  remove,
  indexOf,
  pageSwitch,
}
