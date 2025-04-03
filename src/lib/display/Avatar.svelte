<script lang="ts" module>
  import './Avatar.css'
  import AvatarIcon from '../icons/user-fill.svg?raw'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import { type Snippet } from 'svelte'
  import type { HTMLImgAttributes } from 'svelte/elements'

  /** 头像 */
  export interface ImageAttributes extends HTMLImgAttributes {
    /** 占位图 */
    fallback?: string | IconOption | Snippet
    /** 图片的填充模式 */
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    /** 按钮形状。默认值：'normal'，可被 ButtonTheme.shape 覆盖。 */
    shape?: 'normal' | 'rounded' | 'rectangular' | number
    /** 头像的尺寸 */
    size?: number | string
    /** 组件点击事件 */
    onClick?: (e: MouseEvent) => void
  }
</script>

<script lang="ts">
  let { fallback, fit, shape, size, class: clazz, style, onClick, ...props }: ImageAttributes = $props()

  let _state = $state('loading')

  let _size = $derived(!size ? '44px' : typeof size === 'number' ? `${size}px` : size)

  let _radius = $derived.by(() => {
    if (shape === 'normal') return '6px'
    else if (shape === 'rounded') return '9999px'
    else if (shape === 'rectangular') return '0'
    else if (typeof shape === 'number' && shape >= 0) return `${shape}px`
    else return '6px'
  })

  function handleClick(e: MouseEvent) {
    onClick?.(e)
  }

  function handleLoad() {
    _state = 'success'
  }

  function handleError() {
    _state = 'error'
  }

  function useImg(img: HTMLImageElement) {
    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="sun-parakeet-avatar {clazz}"
  style:width={_size}
  style:height={_size}
  style:border-radius={_radius}
  {style}
  onclick={handleClick}
>
  {#if _state !== 'success'}
    <div class="sun-parakeet-avatar__tip">
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
  {#if _state !== 'error'}
    <img
      use:useImg
      class="sun-parakeet-avatar__img"
      style:object-fit={fit}
      style:display={_state === 'success' ? 'block' : 'none'}
      {...props}
    />
  {/if}
</div>
