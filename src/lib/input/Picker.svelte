<script lang="ts" module>
  import './Picker.css'

  import { untrack } from 'svelte'
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from '../feedback/Popup.svelte'
  import PickerView, { type PickerViewAttributes } from './PickerView.svelte'

  /** 动作面板属性 */
  export type PickerAttributes = PopupAttributes &
    PickerViewAttributes & {
      /** 标题 */
      title?: string
      /** 确认按钮文本 */
      ok?: string
      /** 取消按钮文本 */
      cancel?: string
      /** 取消时触发 */
      oncancel?: () => void
      // 屏蔽
      position?: undefined
      // 屏蔽
      onclose?: undefined
    }
</script>

<script lang="ts">
  let {
    visible = $bindable(),
    value = $bindable(),
    title = '',
    ok = '确定',
    cancel = '取消',
    columns,
    loader,
    onChange,
    onclose,
    ...props
  }: PickerAttributes = $props()

  let _values = $state(value)

  function onOk() {
    visible = false
    value = [..._values]
    onChange?.(value)
  }

  function onCancel() {
    visible = false
    _values = [...value]
  }

  $effect(() => {
    if (!value) value = []
    untrack(() => (_values = [...value]))
  })
</script>

<Popup class="ys-picker" bind:visible position="bottom" {...props}>
  <header class="flex w-full items-center justify-stretch border-b border-b-gray-200 p-2">
    <Button color="normal" onclick={onCancel}>{cancel}</Button>
    <h1 class="flex-1 text-center">{title}</h1>
    <Button color="primary-plain" onclick={onOk}>{ok}</Button>
  </header>
  <PickerView bind:value={_values} {columns} {loader} />
</Popup>
