<script lang="ts" module>
  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { IconOption } from '../common/Icon.svelte'

  /** 列表项 */
  export interface ListItemAttributes extends HTMLAttributes<HTMLElement> {
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
    // 屏蔽
    color?: undefined
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

  let iconed = $derived(icon || (clickable && !disabled ? 'arrow-right-s-line' : undefined))
</script>

{#snippet inner()}
  <!-- aside -->
  {#if aside}
    <div class="sp-list-item__aside">
      {@render aside()}
    </div>
  {/if}

  <!-- content -->
  <div class="sp-list-item__content">
    <!-- header -->
    {#if typeof header === 'string'}
      <span class="sp-list-item__header">{header}</span>
    {:else if typeof header === 'function'}
      {@render header()}
    {/if}
    <!-- children -->
    {#if children}
      <div class="sp-list-item__children">
        {@render children?.()}
      </div>
    {/if}
    <!-- description -->
    {#if typeof description === 'string'}
      <span class="sp-list-item__description">{description}</span>
    {:else if typeof description === 'function'}
      {@render description()}
    {/if}
  </div>

  <!-- extra -->
  {#if typeof extra === 'string'}
    <span class="sp-list-item__extra">{extra}</span>
  {:else if typeof extra === 'function'}
    <div class="sp-list-item__extra">
      {@render extra()}
    </div>
  {/if}

  <!-- icon -->
  {#if typeof iconed === 'string'}
    <Icon class="sp-list-item__icon" name={iconed} />
  {:else if typeof iconed === 'object'}
    <Icon class="sp-list-item__icon" {...iconed} />
  {/if}
{/snippet}

<div class="sp-list-item {clazz}" {...props}>
  {#if clickable}
    <Button class="sp-list-item__inner" color="text" shape="rectangular" {disabled}>
      {@render inner()}
    </Button>
  {:else}
    <div class="sp-list-item__inner">
      {@render inner()}
    </div>
  {/if}
</div>

<style lang="postcss">
  .sp-list-item {
    @apply relative mt-[-1px] py-[1px];
    --sp-border-color: #e5e7eb;

    &::before {
      @apply absolute left-4 right-0 top-0;
      content: '';
      height: 1px;
      background-color: var(--sp-border-color);
    }

    &::after {
      @apply absolute bottom-0 left-4 right-0;
      content: '';
      height: 1px;
      background-color: var(--sp-border-color);
    }

    .sp-list-item__inner,
    :global(button.sp-list-item__inner.sp-button) {
      @apply relative box-border flex h-full w-full flex-nowrap items-center justify-stretch p-2 pl-4 text-left;
      min-height: var(--sp-min-height, 48px);

      .sp-list-item__aside {
        @apply mr-2;
      }

      .sp-list-item__content {
        @apply flex flex-1 flex-col items-start justify-center;

        .sp-list-item__children {
          @apply text-base;
          font-size: 17px;
        }

        .sp-list-item__header,
        .sp-list-item__description {
          @apply overflow-hidden text-gray-500;
          font-size: 13px;
          line-height: 19px;
        }
      }

      .sp-list-item__extra {
        @apply ml-4 text-gray-500;
        font-size: 15px;
      }

      :global(.sp-list-item__icon) {
        @apply ml-2 text-gray-400;
      }
    }
  }
</style>
