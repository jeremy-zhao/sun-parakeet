<script lang="ts" module>
  import './Picker.css'
  import LoadingIcon from '../icons/loading.svg?raw'

  import { getContext, setContext, onMount, untrack, type Snippet } from 'svelte'
  import Icon from '../common/Icon.svelte'
  import PickerBase, { type PickerBaseAttributes } from './PickerBase.svelte'
  import PickerView, { equals, type PickerViewAttributes } from './PickerView.svelte'
  import type { PickerItem } from './PickerColumn.svelte'
  import type { FormItemContext } from './FormItem.svelte'

  /** 动作面板属性 */
  export type PickerAttributes = Omit<
    PickerBaseAttributes,
    'isOkDisabled' | 'isClearDisabled' | 'onOk' | 'onClose'
  > &
    PickerViewAttributes & {
      /** 自定义内容显示。仅作为 FormItem 子元素时生效 */
      display?: Snippet<[labels: string[]]>
      /** 占位文本。仅作为 FormItem 子元素时生效 */
      placeholder?: string
      /** 是否只读。仅作为 FormItem 子元素时生效 */
      readonly?: boolean
      /** 是否禁用。仅作为 FormItem 子元素时生效 */
      disabled?: boolean
    }
</script>

<script lang="ts">
  let {
    value = $bindable([]),
    placeholder = '请选择',
    display,
    readonly = false,
    disabled = false,
    onChange,
    columns = 1,
    loader,
    visible = $bindable(false),
    ...props
  }: PickerAttributes = $props()

  const pickerView = { columns, loader }

  let formItem = getContext<FormItemContext | undefined>('sun_parakeet_form_item')

  function onFormItemClick() {
    visible = true
  }

  $effect(() => {
    const clickable = !disabled && !readonly

    untrack(() => {
      if (!formItem) return
      formItem.onClick = clickable ? onFormItemClick : undefined
    })
  })

  onMount(() => {
    return () => {
      if (formItem?.onClick === onFormItemClick) {
        formItem.onClick = undefined
      }
    }
  })

  let _init = $state(false)
  let _values = $state<unknown[]>([...value])
  let _latest = $state<unknown[]>([])

  let __columns = $state(new Array<PickerItem[]>(columns))
  let _columns = setContext('sun_parakeet_picker_columns', __columns)

  let _display = $state<string[]>([])
  let _displayLoading = $state(false)

  function handleOk() {
    visible = false
    value = [..._values]
    _latest = [..._values]
    onChange?.(value)
  }

  function handleClear() {
    visible = false
    value = []
    _latest = []
    onChange?.(value)
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
    })
  })

  let isOkDisabled = $derived(!_values.length)
  let isClearDisabled = $derived(!value.length)
</script>

{#if formItem}
  <div class="sunp-picker-input" class:sunp-picker-input-disabled={disabled}>
    {#if !value?.length && placeholder}
      <span class="sunp-form-item__placeholder">{placeholder}</span>
    {:else if _displayLoading}
      <Icon class="sunp-picker-input__icon-loading" svg={LoadingIcon} size={23} />
    {:else if typeof display === 'function'}
      {@render display(_display)}
    {:else}
      {_display.join('/')}
    {/if}
  </div>
{/if}

<PickerBase
  bind:visible
  {isOkDisabled}
  {isClearDisabled}
  {...props}
  onOk={handleOk}
  onClear={handleClear}
>
  <PickerView bind:value={_values} {...pickerView} />
</PickerBase>
