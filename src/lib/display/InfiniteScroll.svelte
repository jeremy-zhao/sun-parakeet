<script lang="ts" module>
  import './InfiniteScroll.css'
  import EllipsisIcon from '../icons/ellipsis.svg?raw'

  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'

  /** 无限滚动状态 */
  export type InfiniteScrollStatus =
    /** 空闲状态 */
    | 'idle'
    /** 加载中 */
    | 'loading'
    /** 加载失败 */
    | 'error'
    /** 全部加载完成 */
    | 'finished'

  /** 无限滚动属性 */
  export interface InfiniteScrollAttributes extends HTMLAttributes<EventTarget> {
    /** 底部加载状态区域 */
    footer?: Snippet<[status: InfiniteScrollStatus]>
    /** 是否还有更多内容 */
    hasMore?: boolean
    /** 加载更多回调函数(retry: 重试) */
    loadMore?: (retry: boolean) => Promise<void>
    /** 触发加载事件的滚动触底距离阈值，单位为 px。不包含 footer 的高度 */
    threshold?: number
  }
</script>

<script lang="ts">
  let {
    footer = footerSnippet,
    hasMore = false,
    loadMore,
    threshold = 0,
    children,
    class: clazz,
    ...props
  }: InfiniteScrollAttributes = $props()

  let _self: HTMLDivElement
  let _container: HTMLDivElement
  let _status = $state<InfiniteScrollStatus>('idle')
  let _loading = false

  async function loadRec() {
    console.log(
      'hasMore',
      hasMore,
      'loading',
      _loading,
      'status',
      _status,
      'height',
      _self.clientHeight
    )

    if (!hasMore) return
    if (_loading) return
    if (_status !== 'idle') return
    if (_self.clientHeight <= 0) return

    if (_container.clientHeight >= _self.clientHeight) {
      const offset = _container.clientHeight - _self.clientHeight - _self.scrollTop
      if (offset >= threshold) return
    }

    _loading = true
    _status = 'loading'

    try {
      console.log('[InfiniteScroll]', 'loadMore')
      console.log('offset', _container.clientHeight, '-', _self.clientHeight, '-', _self.scrollTop)
      await loadMore?.(false)
    } catch {
      _status = 'error'
      return
    } finally {
      _loading = false
      _status = hasMore ? 'idle' : 'finished'
    }

    return await loadRec()
  }

  function handleTouchStart(e: TouchEvent) {
    if (_self.scrollTop > 0 || _loading) {
      e.stopPropagation()
    }
  }

  onMount(() => {
    // 滚动事件
    _self.addEventListener('scroll', loadRec)
    _self.addEventListener('touchstart', handleTouchStart)

    // 内容改变
    const mutation = new MutationObserver(() => {
      // console.log('MutationObserver')
      loadRec()
    })

    mutation.observe(_container, { childList: true, subtree: true })

    // 滚动高度改变
    const resize = new ResizeObserver(() => {
      // console.log('ResizeObserver', _container.clientHeight)
      loadRec()
    })

    resize.observe(_container)

    // 可见性改变
    const intersection = new IntersectionObserver(cb => {
      const found = cb.find(x => x.target === _container)
      if (!found || !found.isIntersecting) return

      // console.log('IntersectionObserver', _self.clientHeight)
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
    if (hasMore) {
      loadRec()
    } else {
      _status = 'finished'
    }
  })
</script>

{#snippet footerSnippet(status: InfiniteScrollStatus)}
  <footer class="sun-parakeet-infinite-scroll__footer">
    {#if status === 'idle' || status === 'loading'}
      <span>加载中</span><Icon svg={EllipsisIcon} width="32" height="14" />
    {:else if status === 'finished'}
      <span>没有更多了</span>
    {:else if status == 'error'}
      <span>加载失败</span>
      <!-- svelte-ignore a11y_missing_attribute -->
      <a role="button">重新加载</a>
    {/if}
  </footer>
{/snippet}

<div bind:this={_self} class="sun-parakeet-infinite-scroll {clazz}" {...props}>
  <div bind:this={_container} class="sun-parakeet-infinite-scroll__container">
    {@render children?.()}
  </div>
  {@render footer(_status)}
</div>
