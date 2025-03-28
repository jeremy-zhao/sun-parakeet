<script lang="ts" module>
  import './Picker.css'

  import { untrack, getContext, setContext, onMount, type Snippet, onDestroy } from 'svelte'
  import Button from '../common/Button.svelte'
  import Popup, { type PopupAttributes } from '../feedback/Popup.svelte'
  import PickerView, { equals, type PickerViewAttributes } from './PickerView.svelte'
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
    placeholder,
    clearable = false,
    columns = 1,
    loader,
    onChange,
    onCancel,
    children,
    ...props
  }: PickerAttributes = $props()

  let _values = $state<unknown[]>([])

  let __columns = $state(new Array<PickerItem[]>(columns))
  let _columns = setContext('sun_parakeet_picker_columns', __columns)

  let display = $state('')
  let displayLoading = $state(false)

  let formItem = getContext<FormItemContext | undefined>('sun_parakeet_form_item')

  function onFormItemClick() {
    visible = true
  }

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

  async function makeDisplay() {
    displayLoading = true

    const text = []

    for (let i = 0, len = value.length; i < len; i++) {
      let column = _columns[i]
      let found = column?.find(x => x.value === value[i])

      if (!found) {
        const loaded = await Promise.resolve(loader(value.slice(0, i)))

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

    displayLoading = false

    return text.join('/')
  }

  $effect(() => {
    const values = value

    untrack(() => {
      if (equals(values, _values)) return
      _values = [...values]
      makeDisplay().then(val => (display = val))
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
  {#if !value?.length}
    <span class="sun-parakeet-form-item-button__placeholder">{placeholder}</span>
  {:else if children}
    {@render children()}
  {:else if displayLoading}
    <span>TODO Loading...</span>
  {:else}
    {display}
  {/if}
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
