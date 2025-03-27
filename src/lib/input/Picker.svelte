<script lang="ts" module>
  import './Picker.css'

  import { untrack, getContext, setContext, type Snippet } from 'svelte'
  import Button from '../common/Button.svelte'
  import FormItemButton from './FormItemButton.svelte'
  import Popup, { type PopupAttributes } from '../feedback/Popup.svelte'
  import PickerView, { type PickerViewAttributes } from './PickerView.svelte'
  import type { PickerItem } from './PickerColumn.svelte'
  import type { FormItemContext } from './FormItem.svelte'

  /** 动作面板属性 */
  export type PickerAttributes = PopupAttributes &
    PickerViewAttributes & {
      /** 标题 */
      header?: string | Snippet
      /** 确认按钮文本 */
      ok?: string
      /** 取消按钮文本 */
      cancel?: string
      /** 取消按钮显示文本 */
      clear?: string
      /** 是否显示 */
      clearable?: boolean
      /** 取消时触发 */
      onCancel?: () => void
      // 屏蔽
      position?: undefined
      // 屏蔽
      onclose?: undefined
    }
</script>

<script lang="ts">
  let {
    visible = $bindable(false),
    value = $bindable([]),
    header,
    ok = '确定',
    cancel = '取消',
    clear = '清除',
    clearable = false,
    columns = 1,
    loader,
    onChange,
    onCancel,
    children,
    ...props
  }: PickerAttributes = $props()

  let formItem = getContext<FormItemContext>('sun_parakeet_form_item')
  let _values = $state(value)

  let display = $state('')
  let __columns = $state(new Array<PickerItem[]>(columns))
  let _columns = setContext('sun_parakeet_picker_columns', __columns)

  function handleOk() {
    visible = false
    value = [..._values]
    onChange?.(value)
    formItem?.onChange(value)
  }

  function handleCancel() {
    visible = false
    _values = [...value]
    onCancel?.()
  }

  function handleClear() {
    visible = false
    value = []
    onChange?.(value)
    formItem?.onChange(value)
  }

  function makeDisplay() {
    const text = []

    for (let i = 0, len = value.length; i < len; i++) {
      const found = _columns[i]?.find(x => x.value === value[i])
      if (!found) break
      text[i] = found.label ?? found.value?.toString() ?? ''
    }

    return text.join('/')
  }

  $effect(() => {
    if (!value) value = []
    untrack(() => (_values = [...value]))
    untrack(() => (display = makeDisplay()))
  })
</script>

{#if formItem}
  <FormItemButton class="sun-parakeet-form-item-picker" shape="rectangular" onclick={() => (visible = true)}>
    {#if children}
      {@render children()}
    {:else}
      {display}
    {/if}
  </FormItemButton>
{/if}

<Popup class="sun-parakeet-picker" bind:visible position="bottom" {...props}>
  <header class="sun-parakeet-picker__header">
    <Button color="picker-cancel" onclick={handleCancel}>{cancel}</Button>
    <div class="flex-1 text-center">
      {#if typeof header === 'string'}
        {header}
      {:else if typeof header === 'function'}
        {@render header()}
      {/if}
    </div>
    <Button color="picker-ok" onclick={handleOk}>{ok}</Button>
  </header>
  <PickerView bind:value={_values} {columns} {loader} />
  {#if clearable}
    <footer class="sun-parakeet-picker__footer">
      <Button color="picker-clear" onclick={handleClear}>{clear}</Button>
    </footer>
  {/if}
</Popup>
