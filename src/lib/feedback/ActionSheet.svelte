<script lang="ts" module>
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from './Popup.svelte'
  import ActionSheetItem from './ActionSheetItem.svelte'
  import type { Snippet } from 'svelte'

  /** 动作面板属性 */
  export interface ActionSheetAttributes extends PopupAttributes {
    /** 是否显示 */
    visible: boolean
    /** 标题 */
    header?: string | Snippet
    /** 动作条目 */
    actions: Array<string | unknown>
    /** 动作条目的模板 */
    actionSnippet?: Snippet<[string | unknown, number]>
    /** 取消按钮文本 */
    cancel?: string
    /** 点击选项时触发 */
    onAction?: (action: any, index: number) => void
    /** 取消时触发 */
    onCancel?: () => void
    /** 屏蔽 */
    position?: undefined
    // 屏蔽
    onClose?: undefined
  }
</script>

<script lang="ts">
  let {
    visible = $bindable(),
    position,
    header,
    actions,
    actionSnippet,
    cancel,
    onAction,
    onCancel,
    class: clazz,
    ...props
  }: ActionSheetAttributes = $props()

  function handleAction(action: unknown, index: number) {
    visible = false
    setTimeout(() => onAction?.(action, index), 20)
  }

  function handleCancel() {
    visible = false
    setTimeout(() => onCancel?.(), 20)
  }

  function handleMaskClickClose() {
    onCancel?.()
  }
</script>

{#snippet actionItem(action: unknown)}
  <ActionSheetItem>
    {action}
  </ActionSheetItem>
{/snippet}

<Popup
  bind:visible
  class="sp-action-sheet {clazz}"
  style={cancel ? 'padding-bottom:0px;' : ''}
  position="bottom"
  onclose={handleMaskClickClose}
  {...props}
>
  {#if typeof header === 'string'}
    <header class="sp-action-sheet__header">
      {header}
    </header>
  {:else if typeof header === 'function'}
    <header class="sp-action-sheet__header">
      {@render header()}
    </header>
  {/if}

  <ul class="sp-action-sheet__list">
    {#each actions as action, index}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li class="sp-action-sheet__list-item" onclick={() => handleAction(action, index)}>
        {@render (actionSnippet ?? actionItem)(action, index)}
      </li>
    {/each}
  </ul>

  {#if cancel && typeof cancel === 'string'}
    <footer class="sp-action-sheet__footer">
      <Button class="sp-action-sheet__cancel" onclick={handleCancel}>{cancel}</Button>
    </footer>
  {/if}
</Popup>

<style lang="postcss">
  :global(.sp-action-sheet) {
    .sp-action-sheet__header {
      @apply box-content flex items-center justify-center border-b border-b-gray-300 text-gray-500;
      font-size: 15px;
      padding: 18px 12px;
    }

    .sp-action-sheet__list {
      @apply flex flex-col items-stretch justify-end;

      .sp-action-sheet__list-item {
        @apply flex flex-col items-stretch justify-stretch border-b border-b-gray-300 last:border-none;
      }
    }

    .sp-action-sheet__footer {
      @apply flex flex-col items-stretch justify-stretch border-t-8 border-b-gray-300;

      :global(.sp-action-sheet__cancel) {
        @apply box-content h-8 rounded-none border-0 pb-safe-or-2;
      }
    }
  }
</style>
