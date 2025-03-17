<script lang="ts" module>
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from './Popup.svelte'
  import ActionSheetItem from './ActionSheetItem.svelte'
  import type { Snippet } from 'svelte'

  /** 动作面板属性 */
  export interface ActionSheetAttributes extends PopupAttributes {
    /** 是否显示 */
    visible: boolean
    /** 屏蔽 */
    position?: undefined
    /** 标题 */
    title?: string
    /** 动作条目 */
    actions: any[]
    /** 动作条目的模板 */
    actionSnippet?: Snippet<[number, any]>
    /** 取消按钮文本 */
    cancel?: string
    /** 点击选项时触发 */
    onaction?: (index: number, item: any) => void
    /** 取消时触发 */
    oncancel?: () => void
    // 屏蔽
    onclose?: undefined
  }
</script>

<script lang="ts">
  let {
    visible = $bindable(),
    position,
    title,
    actions,
    actionSnippet,
    cancel,
    onaction,
    oncancel,
    ...props
  }: ActionSheetAttributes = $props()

  function handleAction(index: number, item: any) {
    visible = false
    setTimeout(() => onaction?.(index, item), 20)
  }

  function handleCancel() {
    visible = false
    setTimeout(() => oncancel?.(), 20)
  }

  function handleMaskClickClose() {
    oncancel?.()
  }
</script>

{#snippet actionItem(index: number, item: any)}
  <ActionSheetItem>
    {typeof item === 'string' ? item : item.toString()}
  </ActionSheetItem>
{/snippet}

<Popup
  {...props}
  style={cancel ? 'padding-bottom:0px;' : ''}
  bind:visible
  position="bottom"
  onclose={handleMaskClickClose}
>
  {#if title}
    <header class="text-gray box-content flex h-10 items-center justify-center border-b border-b-gray-300">
      {title}
    </header>
  {/if}

  <ul class="flex flex-col items-stretch justify-end">
    {#each actions as item, index}
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <li
        class="flex flex-col items-stretch justify-stretch border-b border-b-gray-300 last:border-none"
        onclick={() => handleAction(index, item)}
      >
        {@render (actionSnippet ?? actionItem)(index, item)}
      </li>
    {/each}
  </ul>

  {#if cancel && typeof cancel === 'string'}
    <footer class="flex flex-col items-stretch justify-stretch border-t-8 border-b-gray-300">
      <Button class="box-content h-8 rounded-none border-0 pb-safe-or-2" onclick={handleCancel}>{cancel}</Button>
    </footer>
  {/if}
</Popup>
