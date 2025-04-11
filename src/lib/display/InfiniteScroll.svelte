<script lang="ts" module>
  import './InfiniteScroll.css'
  import EllipsisIcon from '../icons/ellipsis.svg?raw'

  import { onMount, tick, type Snippet } from 'svelte'
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
    /** 触发加载事件的滚动触底距离阈值，单位为 px */
    threshold?: number
  }
</script>

<script lang="ts">
  let {
    footer = footerSnippet,
    hasMore = false,
    loadMore,
    threshold = 250,
    children,
    class: clazz,
    ...props
  }: InfiniteScrollAttributes = $props()

  let _self: HTMLDivElement
  let _status = $state<InfiniteScrollStatus>('idle')
  let _loading = false

  $inspect(_status)

  async function loadRec() {
    if (!hasMore) return
    if (_loading) return
    if (_status !== 'idle') return

    if (_self.scrollHeight > _self.clientHeight) {
      const offset = _self.scrollHeight - _self.clientHeight - _self.scrollTop
      if (offset > threshold) return
    }

    _loading = true
    _status = 'loading'

    try {
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

  onMount(() => {
    _self.addEventListener('scroll', loadRec)

    const observer = new MutationObserver(cb => {
      cb.find(x => x.type === 'childList')
    })

    observer.observe(_self, { childList: true, subtree: true })

    return () => observer.disconnect()
  })

  $effect(() => {
    if (hasMore) {
      if (!_loading) {
        _status = 'idle'
        loadRec()
      }
    } else {
      _status = 'finished'
    }
  })
</script>

{#snippet footerSnippet(status: InfiniteScrollStatus)}
  <footer class="sun-parakeet-infinite-scroll__footer">
    {#if status === 'idle'}
      <span>加载更多</span>
    {:else if status === 'loading'}
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
  {@render children?.()}
  {@render footer(_status)}
</div>
