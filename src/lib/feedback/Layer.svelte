<script lang="ts" module>
  import { browser } from '$app/environment'
  import { pushState, afterNavigate, onNavigate } from '$app/navigation'
  import { page } from '$app/state'
  import { writable, readonly, get } from 'svelte/store'
  import type { OnNavigate, AfterNavigate } from '@sveltejs/kit'
  import { delay } from '../common'

  export interface ToastLayer {
    type: 'toast'
    keepOpen: boolean
    navigation?: number
    destroyed?: boolean
  }

  export function isToastLayer(layer: Layer): layer is ToastLayer {
    return layer.type === 'toast'
  }

  export interface PopupLayer {
    type: 'popup'
    index: number
    navigation?: number
    destroyed?: boolean
  }

  export function isPopupLayer(layer: Layer): layer is PopupLayer {
    return layer.type === 'popup'
  }

  export type Layer = ToastLayer | PopupLayer

  let _nav0 = 0
  let _navT = 0

  const _layers = writable<Layer[]>([])
  export const layers = readonly(_layers)

  function getNavigation() {
    return history.state['sveltekit:navigation'] as number
  }

  export function pushLayer(layer: Layer) {
    layer.navigation = getNavigation()
    const layers = get(_layers)
    _layers.set([...layers, layer])
    pushState('', page.state)
  }

  function findLast<T>(array: Array<T>, predicate: (value: T) => any) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i])) return array[i]
    }
  }

  function handlePopState() {
    const nav = getNavigation()
    if (_navT !== nav) return

    const layers = get(_layers)
    if (!layers.length) return

    const poped =
      findLast(layers, x => x.navigation === nav && x.destroyed) ??
      findLast(layers, x => x.navigation === nav)

    if (!poped) return

    if (isToastLayer(poped) && poped.keepOpen && !poped.destroyed) {
      pushState('', page.state)
      window.addEventListener('beforeunload', handleUnload)
      window.addEventListener('click', removeUnload)
      return
    }

    poped.destroyed = true
    _layers.set(layers.filter(x => x !== poped))
  }

  function handleUnload(e: BeforeUnloadEvent) {
    e.preventDefault()
  }

  function removeUnload() {
    const opening = get(_layers).find(x => isToastLayer(x) && x.keepOpen && !x.destroyed)
    if (opening) return

    window.removeEventListener('beforeunload', handleUnload)
    window.removeEventListener('click', removeUnload)
  }

  if (browser) {
    window.addEventListener('popstate', handlePopState)
  }
</script>

<script lang="ts">
  onNavigate(handleNavigate)
  afterNavigate(handleNavigate)

  function handleNavigate(cb: OnNavigate | AfterNavigate) {
    const nav = getNavigation()
    if (_navT === nav) return
    _nav0 = _navT
    _navT = nav

    switch (cb.type) {
      case 'goto':
        return next(nav)
      case 'popstate':
        return prev(nav)
    }
  }

  function next(nav: number) {
    const layers: Layer[] = []

    let toastLayer: ToastLayer | undefined

    for (const layer of get(_layers)) {
      if (isToastLayer(layer) && !layer.destroyed) {
        toastLayer = layer
        layers.push({ ...layer, destroyed: true })
        pushState('', page.state)
      } else {
        layer.destroyed = true
        layers.push(layer)
      }
    }

    if (toastLayer) {
      toastLayer.navigation = nav
      layers.push(toastLayer)
    }

    _layers.set(layers)
  }

  async function prev(nav: number) {
    const layers: Layer[] = []

    let toastLayer: ToastLayer | undefined

    for (const layer of get(_layers)) {
      if (!layer.navigation) continue

      if (layer.navigation < nav) {
        layers.push(layer)
      } else if (layer.navigation === nav && layer.destroyed) {
        history.back()
      } else if (isToastLayer(layer) && layer.navigation > nav) {
        toastLayer = layer
      }
    }

    _layers.set(layers)

    if (toastLayer) {
      await delay(10)
      pushLayer(toastLayer)
    }
  }
</script>
