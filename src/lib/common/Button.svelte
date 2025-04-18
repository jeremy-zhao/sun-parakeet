<script lang="ts" module>
  import './Button.css'
  import LoadingIcon from '../icons/loading.svg?raw'

  import { type Snippet } from 'svelte'
  import { type HTMLButtonAttributes } from 'svelte/elements'
  import Icon, { type IconOption } from '../common/Icon.svelte'

  /** 按钮 */
  export interface ButtonAttributes extends HTMLButtonAttributes {
    /** 是否渲染为块级元素 */
    block?: boolean
    /** 按钮颜色。默认值：'normal' */
    color?: string
    /** 按钮是否处于加载状态 */
    loading?: boolean
    /** 加载状态图标 */
    loadingIcon?: string | IconOption | Snippet
  }
</script>

<script lang="ts">
  let {
    block = false,
    color = 'normal',
    loading = false,
    loadingIcon,
    children,
    class: clazz,
    disabled = false,
    ...props
  }: ButtonAttributes = $props()

  let _color = $derived(disabled ? 'disabled' : color)
  let _loading = $derived(disabled ? false : loading)
</script>

<button
  class="sunp-button sunp-button-{_color} {clazz}"
  class:sunp-button-block={block}
  class:sunp-button-loading={loading}
  disabled={disabled || loading}
  {...props}
>
  <div class="sunp-button__content">
    {#if _loading}
      <div class="sunp-button__loading">
        {#if typeof loadingIcon === 'object'}
          <Icon {...loadingIcon} />
        {:else if typeof loadingIcon === 'function'}
          {@render loadingIcon()}
        {:else}
          <Icon class="sunp-button__loading-icon" svg={LoadingIcon} size={22} top={-2} />
        {/if}
      </div>
    {/if}
    {@render children?.()}
  </div>
</button>
