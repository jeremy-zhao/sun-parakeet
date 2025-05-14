<script lang="ts" module>
  import './Picker.css'

  import { getContext, setContext, onMount, untrack, type Snippet } from 'svelte'
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from '../feedback/Popup.svelte'
  import PickerView, { equals, type PickerViewAttributes } from './PickerView.svelte'
  import type { PickerItem } from './PickerColumn.svelte'
  import type { FormItemContext } from './FormItem.svelte'

  /** 动作面板属性 */
  export type PickerAttributes = Omit<PopupAttributes, 'position' | 'onClose'> &
    PickerViewAttributes & {
      /** 标题 */
      header?: string | Snippet
      /** 确认按钮文本 */
      ok?: string
      /** 取消按钮文本 */
      cancel?: string
      /** 清除按钮文本 */
      clear?: string
      /** 是否显示清除按钮 */
      clearable?: boolean
      /** 自定义内容显示 */
      display?: Snippet<[labels: string[]]>
      /** 取消事件 */
      onCancel?: () => void
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
    placeholder,
    clearable = false,
    columns = 1,
    loader,
    onChange,
    onCancel,
    display,
    children,
    ...props
  }: PickerAttributes = $props()

  let _init = $state(false)
  let _values = $state<unknown[]>([...value])
  let _latest = $state<unknown[]>([])

  let __columns = $state(new Array<PickerItem[]>(columns))
  let _columns = setContext('sun_parakeet_picker_columns', __columns)

  let _display = $state<string[]>([])
  let _displayLoading = $state(false)

  let formItem = getContext<FormItemContext | undefined>('sun_parakeet_form_item')

  function onFormItemClick() {
    visible = true
  }

  function handleOk() {
    visible = false
    value = [..._values]
    _latest = [..._values]
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
    _latest = []
    onChange?.(value)
    formItem?.onChange(value)
  }

  function init() {
    if (_init) return false
    _init = true
    _latest = [...value]
    return true
  }

  async function makeDisplay() {
    _displayLoading = true

    const text = []

    for (let i = 0, len = value.length; i < len; i++) {
      let column = _columns[i]
      let found = column?.find(x => x.value === value[i])

      if (!found) {
        const vals = value.slice(0, i)
        const loaded = await Promise.resolve(loader(vals))

        if (!equals(vals, value.slice(0, i))) return

        column = loaded
          .map(x => {
            if (typeof x === 'object') {
              return x
            } else if (typeof x === 'string') {
              return { value: x }
            }
          })
          .filter(x => x) as PickerItem[]
      }

      found = column?.find(x => x.value === value[i])
      if (!found) break

      text.push(found.label ?? found.value?.toString() ?? '')
    }

    _display = text
    _displayLoading = false
  }

  $effect(() => {
    const values = [...value]

    untrack(() => {
      makeDisplay()

      if (init()) return

      if (equals(values, _latest)) return

      _values = [...values]
      _latest = [...values]
      formItem?.onReset()
    })
  })

  onMount(() => {
    formItem && (formItem.onClick = onFormItemClick)

    return () => {
      if (formItem?.onClick === onFormItemClick) {
        formItem.onClick = undefined
      }
    }
  })
</script>

{#if formItem}
  {#if !value?.length && placeholder}
    <span class="sunp-form-item-button__placeholder">{placeholder}</span>
  {:else if _displayLoading}
    <span>TODO Loading...</span>
  {:else if typeof display === 'function'}
    {@render display(_display)}
  {:else if typeof children === 'function'}
    {@render children()}
  {:else}
    {_display.join('/')}
  {/if}
{/if}

<Popup class="sunp-picker" bind:visible position="bottom" {...props}>
  <header class="sunp-picker__header">
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
    <footer class="sunp-picker__footer">
      <Button color="picker-clear" onclick={handleClear}>{clear}</Button>
    </footer>
  {/if}
</Popup>
