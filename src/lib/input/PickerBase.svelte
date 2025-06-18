<script lang="ts" module>
  import './PickerBase.css'

  import { type Snippet } from 'svelte'
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from '../feedback/Popup.svelte'

  export type PickerBaseAttributes = Omit<PopupAttributes, 'position' | 'onClose'> & {
    /** 标题 */
    header?: string | Snippet
    /** 是否显示清除按钮 */
    clearable?: boolean
    /** 确认按键禁用状态 */
    isOkDisabled?: boolean
    /** 清除按键禁用状态 */
    isClearDisabled?: boolean
    /** 确认事件 */
    onOk?: () => void
    /** 取消事件 */
    onCancel?: () => void
    /** 清除事件 */
    onClear?: () => void
  }
</script>

<script lang="ts">
  let {
    header,
    clearable = false,
    isOkDisabled = false,
    isClearDisabled = false,
    onOk,
    onCancel,
    onClear,
    children,
    visible = $bindable(false),
    class: clazz,
    ...props
  }: PickerBaseAttributes = $props()

  function handleCancel() {
    visible = false
    onCancel?.()
  }
</script>

<Popup class="sunp-picker {clazz}" bind:visible {...props}>
  <header class="sunp-picker__header">
    <Button color="picker-cancel" onclick={handleCancel}>取消</Button>
    <div class="sunp-picker__header-title">
      {#if typeof header === 'string'}
        {header}
      {:else if typeof header === 'function'}
        {@render header()}
      {/if}
    </div>
    <Button color="picker-ok" onclick={onOk} disabled={isOkDisabled}>确认</Button>
  </header>
  {@render children?.()}
  {#if clearable}
    <footer class="sunp-picker__footer">
      <Button color="picker-clear" onclick={onClear} disabled={isClearDisabled}>清除</Button>
    </footer>
  {/if}
</Popup>
