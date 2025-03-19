<script lang="ts" module>
  import './ActionSheet.css'

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
  class="sun-parakeet-action-sheet {clazz}"
  style={cancel ? 'padding-bottom:0px;' : ''}
  position="bottom"
  onclose={handleMaskClickClose}
  {...props}
>
  {#if typeof header === 'string'}
    <header class="sun-parakeet-action-sheet__header">
      {header}
    </header>
  {:else if typeof header === 'function'}
    <header class="sun-parakeet-action-sheet__header">
      {@render header()}
    </header>
  {/if}

  <ul class="sun-parakeet-action-sheet__list">
    {#each actions as action, index}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li class="sun-parakeet-action-sheet__list-item" onclick={() => handleAction(action, index)}>
        {@render (actionSnippet ?? actionItem)(action, index)}
      </li>
    {/each}
  </ul>

  {#if cancel && typeof cancel === 'string'}
    <footer class="sun-parakeet-action-sheet__footer">
      <Button class="sun-parakeet-action-sheet__cancel" onclick={handleCancel}>{cancel}</Button>
    </footer>
  {/if}
</Popup>
