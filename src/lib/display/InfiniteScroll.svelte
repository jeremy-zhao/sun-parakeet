<script lang="ts" module>
  import './InfiniteScroll.css'
  import LoadingIcon from '../icons/loading.svg?raw'

  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'

  /** 无限滚动状态 */
  export type InfiniteScrollStatus =
    /** 空闲状态 */
    | 'idle'
    /** 加载中 */
    | 'loading'
    /** 加载完成 */
    | 'finished'
    /** 加载失败 */
    | 'error'

  /** 无限滚动属性 */
  export interface InfiniteScrollAttributes extends HTMLAttributes<EventTarget> {
    /** 是否还有更多内容 */
    hasMore: boolean
    /** 加载更多回调函数(retry: 重试) */
    loadMore: (retry: boolean) => Promise<void>
    /** 底部加载状态区域 */
    footer?: Snippet<[status: InfiniteScrollStatus, reload: () => Promise<void>]>
    /** 触发加载事件的滚动触底距离阈值，单位为 px。不包含 footer 的高度 */
    threshold?: number
    /** 加载错误 */
    readonly hasError?: boolean
  }
</script>

<script lang="ts">
  let {
    footer = footerSnippet,
    hasError = $bindable(false),
    hasMore,
    loadMore,
    threshold = 0,
    children,
    class: clazz,
    ...props
  }: InfiniteScrollAttributes = $props()

  let _self: HTMLDivElement
  let _container: HTMLDivElement
  let _loading = $state(false)

  let _status = $derived<InfiniteScrollStatus>(
    !hasMore ? 'finished' : _loading ? 'loading' : hasError ? 'error' : 'idle'
  )

  async function loadRec() {
    if (!hasMore) return
    if (hasError) return
    if (_loading) return
    if (_self.clientHeight <= 0) return

    if (_container.clientHeight >= _self.clientHeight) {
      const offset = _container.clientHeight - _self.clientHeight - _self.scrollTop
      if (offset >= threshold) return
    }

    await load()
    return await loadRec()
  }

  async function load() {
    console.log('[InfiniteScroll]', 'loadMore')
    _loading = true

    try {
      await loadMore?.(hasError)
      hasError = false
    } catch {
      hasError = true
    } finally {
      _loading = false
    }
  }

  function handleTouchStart(e: TouchEvent) {
    if (_self.scrollTop > 0 || _loading) {
      e.stopPropagation()
    }
  }

  onMount(() => {
    _self.addEventListener('scroll', loadRec)
    _self.addEventListener('touchstart', handleTouchStart)

    const mutation = new MutationObserver(() => {
      loadRec()
    })

    mutation.observe(_container, { childList: true, subtree: true })

    const resize = new ResizeObserver(() => {
      loadRec()
    })

    resize.observe(_container)

    const intersection = new IntersectionObserver(cb => {
      const found = cb.find(x => x.target === _container)
      if (!found || !found.isIntersecting) return

      loadRec()
    })

    intersection.observe(_container)

    return () => {
      mutation.disconnect()
      resize.disconnect()
      intersection.disconnect()
    }
  })

  $effect(() => {
    if (!hasMore) return
    loadRec()
  })
</script>

{#snippet footerSnippet(status: InfiniteScrollStatus)}
  <div class="sunp-infinite-scroll__footer-inner">
    {#if status === 'idle' || status === 'loading'}
      <Icon class="sunp-infinite-scroll__footer-loading" svg={LoadingIcon} size={20} />
      <span>加载中...</span>
      {:else if status === 'finished'}
      <span>没有更多了</span>
    {:else if status == 'error'}
      <span>加载失败，</span>
      <a
        role="button"
        tabindex={0}
        onclick={() => load()}
        onkeydown={e => (e.key === ' ' || e.key === 'Enter') && load()}>重新加载</a
      >
    {/if}
  </div>
{/snippet}

<div bind:this={_self} class="sunp-infinite-scroll {clazz}" {...props}>
  <div bind:this={_container} class="sunp-infinite-scroll__container">
    {@render children?.()}
  </div>
  <footer class="sunp-infinite-scroll__footer">
    {@render footer(_status, load)}
  </footer>
</div>
