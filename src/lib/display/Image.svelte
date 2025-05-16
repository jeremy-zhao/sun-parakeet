<script lang="ts" module>
  import './Image.css'
  import ImgIcon from '../icons/image-line.svg?raw'
  import Img404Icon from '../icons/image-404-line.svg?raw'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import { type Snippet } from 'svelte'
  import type { HTMLImgAttributes } from 'svelte/elements'

  /** 图片 */
  export interface ImageAttributes extends HTMLImgAttributes {
    /** 占位图 */
    fallback?: string | IconOption | Snippet
    /** 容器点击事件 */
    onClick?: (e: MouseEvent) => void
  }
</script>

<script lang="ts">
  let { fallback, class: clazz, style, onClick, ...props }: ImageAttributes = $props()

  let _status = $state('loading')

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
  class="sunp-image {clazz}"
  class:sunp-image-clickable={typeof onClick === 'function'}
  {style}
  onclick={handleClick}
>
  {#if _status === 'loading'}
    <div class="sunp-image__tip">
      <Icon svg={ImgIcon} />
    </div>
  {:else if _status === 'error'}
    <div class="sunp-image__tip">
      {#if typeof fallback === 'string'}
        <Icon name={fallback} />
      {:else if typeof fallback === 'object'}
        <Icon {...fallback} />
      {:else if typeof fallback === 'function'}
        {@render fallback()}
      {:else}
        <Icon svg={Img404Icon} />
      {/if}
    </div>
  {/if}
  {#if _status !== 'error'}
    <img use:useImg class="sunp-image__element" {...props} />
  {/if}
</div>
