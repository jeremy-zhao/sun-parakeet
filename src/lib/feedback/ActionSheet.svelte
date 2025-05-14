<script lang="ts" module>
  import './ActionSheet.css'

  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from './Popup.svelte'
  import type { Snippet } from 'svelte'

  /** 动作面板属性 */
  export interface ActionSheetAttributes extends Omit<PopupAttributes, 'position' | 'onClose'> {
    /** 是否显示 */
    visible: boolean
    /** 标题 */
    header?: string | Snippet
    /** 动作条目 */
    actions: (string | unknown)[]
    /** 动作条目的模板 */
    actionSnippet?: Snippet<[any, number]>
    /** 取消按钮文本 */
    cancel?: string
    /** 点击选项时触发 */
    onAction?: (action: any, index: number) => void
    /** 取消时触发 */
    onCancel?: () => void
  }
</script>

<script lang="ts">
  let {
    visible = $bindable(),
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
  <Button color="action-sheet-item" --sunp-border="0px">
    {action}
  </Button>
{/snippet}

<Popup
  bind:visible
  class="sunp-action-sheet {clazz}"
  position="bottom"
  onclose={handleMaskClickClose}
  {...props}
>
  {#if typeof header === 'string'}
    <header class="sunp-action-sheet__header">
      {header}
    </header>
  {:else if typeof header === 'function'}
    <header class="sunp-action-sheet__header">
      {@render header()}
    </header>
  {/if}

  <ul class="sunp-action-sheet__list">
    {#each actions as action, index}
      <li class="sunp-action-sheet__list-item" onclick={() => handleAction(action, index)}>
        {@render (actionSnippet ?? actionItem)(action, index)}
      </li>
    {/each}
  </ul>

  {#if cancel && typeof cancel === 'string'}
    <footer class="sunp-action-sheet__footer">
      <Button color="action-sheet-cancel" onclick={handleCancel}>{cancel}</Button>
    </footer>
  {/if}
</Popup>
