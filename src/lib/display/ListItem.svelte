<script lang="ts" module>
  import './ListItem.css'
  import ArrowIcon from '../icons/arrow-right-s-line.svg?raw'

  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { IconOption } from '../common/Icon.svelte'

  /** 列表项 */
  export interface ListItemAttributes extends HTMLAttributes<EventTarget> {
    /** 列表项左侧区域 */
    aside?: Snippet
    /** 列表项上部的标题区域 */
    header?: string | Snippet
    /** 列表项下部显示的描述 */
    description?: string | Snippet
    /** 列表项右侧区域 */
    extra?: string | Snippet
    /** 右侧图标 */
    icon?: string | IconOption
    /** 是否显示点击效果。默认值：false */
    clickable?: boolean
    /** 是否禁用 */
    disabled?: boolean
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
  {#if aside}
    <div class="sunp-list-item__aside">
      {@render aside()}
    </div>
  {/if}

  <div class="sunp-list-item__content">
    {#if typeof header === 'string'}
      <span class="sunp-list-item__header">{header}</span>
    {:else if typeof header === 'function'}
      {@render header()}
    {/if}
    {@render children?.()}
    {#if typeof description === 'string'}
      <span class="sunp-list-item__description">{description}</span>
    {:else if typeof description === 'function'}
      {@render description()}
    {/if}
  </div>

  {#if typeof extra === 'string'}
    <span class="sunp-list-item__extra">{extra}</span>
  {:else if typeof extra === 'function'}
    <div class="sunp-list-item__extra">
      {@render extra()}
    </div>
  {/if}

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
    <Button class="sunp-list-item__inner" color="list-item" {disabled}>
      {@render inner()}
    </Button>
  {:else}
    <div class="sunp-list-item__inner">
      {@render inner()}
    </div>
  {/if}
</li>
