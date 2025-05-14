<script lang="ts" module>
  import './Avatar.css'
  import AvatarIcon from '../icons/user-fill.svg?raw'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import { type Snippet } from 'svelte'
  import type { HTMLImgAttributes } from 'svelte/elements'

  /** 头像 */
  export interface AvatarAttributes extends HTMLImgAttributes {
    /** 头像形状。默认值 'circle' */
    shape?: 'circle' | 'rounded' | 'square' | number
    /** 头像的尺寸 */
    size?: number | string
    /** 占位图 */
    fallback?: string | IconOption | Snippet
    /** 容器点击事件 */
    onClick?: (e: MouseEvent) => void
  }
</script>

<script lang="ts">
  let _self: HTMLDivElement

  let { fallback, shape, size, class: clazz, style, onClick, ...props }: AvatarAttributes = $props()

  let _status = $state('loading')

  let _size = $derived(!size ? '44px' : typeof size === 'number' ? `${size}px` : size)

  let _radius = $derived.by(() => {
    if (shape === 'circle') return '50%'
    else if (shape === 'rounded') return '6px'
    else if (shape === 'square') return '0'
    else if (typeof shape === 'number' && shape >= 0) return `${shape}px`
    else return '50%'
  })

  function handleClick(e: MouseEvent) {
    onClick?.(e)
  }

  function handleLoad() {
    _status = 'success'
  }

  function handleError() {
    _status = 'error'
  }

  function useImg(img: HTMLImageElement) {
    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
  }
</script>

<div
  bind:this={_self}
  class="sunp-avatar {clazz}"
  class:sunp-avatar-clickable={typeof onClick === 'function'}
  style:width={_size}
  style:height={_size}
  style:border-radius={_radius}
  {style}
  onclick={handleClick}
>
  {#if _status !== 'success'}
    <div class="sunp-avatar__tip">
      {#if typeof fallback === 'string'}
        <Icon name={fallback} />
      {:else if typeof fallback === 'object'}
        <Icon {...fallback} />
      {:else if typeof fallback === 'function'}
        {@render fallback()}
      {:else}
        <Icon svg={AvatarIcon} />
      {/if}
    </div>
  {/if}
  {#if _status !== 'error'}
    <img
      use:useImg
      class="sunp-avatar__img"
      style:display={_status === 'success' ? 'block' : 'none'}
      {...props}
    />
  {/if}
</div>
