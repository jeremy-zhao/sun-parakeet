<script lang="ts" module>
  import './ListItem.css'
  import ArrowIcon from '../icons/arrow-right-s-line.svg?raw'

  import Icon from '../common/Icon.svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { IconOption } from '../common/Icon.svelte'

  /** 列表项 */
  export interface ListItemAttributes extends HTMLAttributes<EventTarget> {
    /** 列表项左侧区域 */
    aside?: Snippet
    /** 是否显示点击效果。默认值：false */
    clickable?: boolean
    /** 列表项下部显示的描述 */
    description?: string | Snippet
    /** 是否禁用 */
    disabled?: boolean
    /** 列表项右侧区域 */
    extra?: string | Snippet
    /** 列表项主题上部的标题区域 */
    header?: string | Snippet
    /** 右侧图标 */
    icon?: string | IconOption
  }
</script>

<script lang="ts">
  let {
    aside,
    header,
    children,
    description,
    extra,
    icon,
    class: clazz,
    clickable = false,
    disabled = false,
    ...props
  }: ListItemAttributes = $props()

  let iconed = $derived(icon || (clickable && !disabled ? { svg: ArrowIcon } : undefined))
</script>

{#snippet inner()}
  <!-- aside -->
  {#if aside}
    <div class="sunp-list-item__aside">
      {@render aside()}
    </div>
  {/if}

  <!-- content -->
  <div class="sunp-list-item__content">
    <!-- header -->
    {#if typeof header === 'string'}
      <span class="sunp-list-item__header">{header}</span>
    {:else if typeof header === 'function'}
      {@render header()}
    {/if}
    <!-- children -->
    {@render children?.()}
    <!-- description -->
    {#if typeof description === 'string'}
      <span class="sunp-list-item__description">{description}</span>
    {:else if typeof description === 'function'}
      {@render description()}
    {/if}
  </div>

  <!-- extra -->
  {#if typeof extra === 'string'}
    <span class="sunp-list-item__extra">{extra}</span>
  {:else if typeof extra === 'function'}
    <div class="sunp-list-item__extra">
      {@render extra()}
    </div>
  {/if}

  <!-- icon -->
  {#if typeof iconed === 'string'}
    <Icon class="sunp-list-item__icon" name={iconed} />
  {:else if typeof iconed === 'object'}
    <Icon class="sunp-list-item__icon" {...iconed} />
  {:else}
    <i class="sunp-list-item__icon"></i>
  {/if}
{/snippet}

<li class="sunp-list-item {clazz}" {...props}>
  {#if clickable}
    <button class="sunp-list-item__inner" {disabled}>
      {@render inner()}
    </button>
  {:else}
    <div class="sunp-list-item__inner">
      {@render inner()}
    </div>
  {/if}
</li>
