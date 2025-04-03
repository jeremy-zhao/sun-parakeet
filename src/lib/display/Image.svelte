<script lang="ts" module>
  import './Image.css'
  import ImgIcon from '../icons/image-line.svg?raw'
  import Img404Icon from '../icons/image-404-line.svg?raw'

  import Icon from '../common/Icon.svelte'
  import { type Snippet } from 'svelte'
  import type { HTMLImgAttributes } from 'svelte/elements'

  /** 头像 */
  export interface ImageAttributes extends HTMLImgAttributes {
    /** 占位图 */
    fallback?: string | Snippet
    /** 图片的填充模式 */
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
    /** 组件点击事件 */
    onClick?: (e: MouseEvent) => void
  }
</script>

<script lang="ts">
  let { fallback, fit, class: clazz, style, onClick, ...props }: ImageAttributes = $props()

  let _state = $state('loading')

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
<div class="sun-parakeet-image {clazz}" {style} onclick={handleClick}>
  {#if _state === 'loading'}
    <div class="sun-parakeet-image__img-loading">
      <Icon svg={ImgIcon} />
    </div>
  {/if}
  {#if _state !== 'error'}
    <img use:useImg class="sun-parakeet-image__img" style:object-fit={fit} {...props} />
  {:else}
    <div class="sun-parakeet-image__img-error">
      <Icon svg={Img404Icon} />
    </div>
  {/if}
</div>
