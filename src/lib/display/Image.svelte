<script lang="ts" module>
  import './Image.css'
  import ImgIcon from '../icons/image-line.svg?raw'
  import Img404Icon from '../icons/image-404-line.svg?raw'

  import Icon, { type IconOption } from '../common/Icon.svelte'
  import { type Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLImgAttributes } from 'svelte/elements'

  /** 头像 */
  export interface ImageAttributes extends HTMLImgAttributes {
    /** 占位图 */
    fallback?: string | IconOption | Snippet
    /** 图片的填充模式 */
    fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  }
</script>

<script lang="ts">
  let {
    fallback,
    fit,
    // img
    class: clazz,
    alt,
    crossorigin,
    decoding,
    fetchpriority,
    height,
    ismap,
    loading,
    referrerpolicy,
    sizes,
    src,
    srcset,
    usemap,
    width,
    'bind:naturalWidth': bindNaturalWidth,
    'bind:naturalHeight': bindNaturalHeight,
    // div
    ...props
  }: ImageAttributes = $props()

  const divProps = props as HTMLAttributes<EventTarget>

  const imgProps = {
    alt,
    crossorigin,
    decoding,
    fetchpriority,
    height,
    ismap,
    loading,
    referrerpolicy,
    sizes,
    src,
    srcset,
    usemap,
    width,
    'bind:naturalWidth': bindNaturalWidth,
    'bind:naturalHeight': bindNaturalHeight,
  }

  let _status = $state('loading')

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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="sunp-image {clazz}" {...divProps}>
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
    <img
      use:useImg
      class="sunp-image__img"
      style:object-fit={fit}
      style:display={_status === 'success' ? 'block' : 'none'}
      {...imgProps}
    />
  {/if}
</div>
