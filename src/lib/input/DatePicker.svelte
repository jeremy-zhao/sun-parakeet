<script lang="ts" module>
  import './DatePicker.css'

  import { getContext, onMount, untrack, type Snippet } from 'svelte'
  import PickerBase, { type PickerBaseAttributes } from './PickerBase.svelte'
  import PickerView from './PickerView.svelte'
  import { type FormItemContext } from './FormItem.svelte'
  import D, { type DatePrecision } from '../common/date'

  export type DatePickerAttributes = Omit<
    PickerBaseAttributes,
    'isOkDisabled' | 'isClearDisabled' | 'onOk' | 'onClose'
  > & {
    /** 当前选中的日期 */
    value?: Date
    /** 日期精度 */
    precision?: DatePrecision
    /** 最大值。默认 10 年后（整年） */
    max?: Date | 'tillNow'
    /** 最小值。默认 10 年前（整年） */
    min?: Date
    /** 自定义内容显示。仅作为 FormItem 子元素时生效 */
    display?: Snippet<[date: Date]>
    /** 占位文本。仅作为 FormItem 子元素时生效 */
    placeholder?: string
    /** 是否只读。仅作为 FormItem 子元素时生效 */
    readonly?: boolean
    /** 是否禁用。仅作为 FormItem 子元素时生效 */
    disabled?: boolean
    /** 变更事件 */
    onChange?: (value: Date | undefined) => void
  }

  const DATE_PRECISION: Record<string, { columns: number }> = {
    year: { columns: 1 },
    month: { columns: 2 },
    day: { columns: 3 },
    hour: { columns: 4 },
    minute: { columns: 5 },
    second: { columns: 6 },
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    precision = 'day',
    max,
    min,
    placeholder = '请选择',
    display,
    readonly = false,
    disabled = false,
    onChange,
    visible = $bindable(false),
    ...props
  }: DatePickerAttributes = $props()

  let _max = $derived.by(() => {
    if (D.isValid(max)) return max

    const now = new Date()
    now.setHours(23, 59, 59, 998)
    if (max === 'tillNow') return now

    now.setFullYear(now.getFullYear() + 10, 11, 31)
    return now
  })

  let _min = $derived.by(() => {
    if (D.isValid(min)) return min

    const now = new Date()
    now.setFullYear(now.getFullYear() - 10, 0, 1)
    now.setHours(0, 0, 0, 0)
    return now
  })

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

  let pickerValue = $state<number[]>(toPickerValue(value))

  function toPickerValue(date?: Date) {
    let dx = D.isValid(date) ? date : new Date()

    if (dx < _min || dx > _max) {
      dx = _min
    }

    const re = [
      dx.getFullYear(),
      dx.getMonth(),
      dx.getDate(),
      dx.getHours(),
      dx.getMinutes(),
      dx.getSeconds(),
    ]

    return re.slice(0, DATE_PRECISION[precision].columns)
  }

  let columns = $derived(DATE_PRECISION[precision].columns)

  function loader(value: number[]) {
    let n0: number
    let nT: number

    let labelFunc: ((i: number) => string) | undefined

    switch (value.length) {
      case 0:
        n0 = _min.getFullYear()
        nT = _max.getFullYear()
        break
      case 1:
        n0 = 0
        nT = 11

        if (_min.getFullYear() === value[0]) {
          n0 = _min.getMonth()
        }

        if (_max.getFullYear() === value[0]) {
          nT = _max.getMonth()
        }

        labelFunc = i => `${i + 1}`
        break
      case 2:
        n0 = 1
        nT = new Date(value[0], value[1] + 1, 0).getDate()

        if (_min.getFullYear() === value[0] && _min.getMonth() === value[1]) {
          n0 = _min.getDate()
        }

        if (_max.getFullYear() === value[0] && _max.getMonth() === value[1]) {
          nT = _max.getDate()
        }
        break
      case 3:
        n0 = 0
        nT = 23

        if (
          _min.getFullYear() === value[0] &&
          _min.getMonth() === value[1] &&
          _min.getDate() === value[2]
        ) {
          n0 = _min.getHours()
        }

        if (
          _max.getFullYear() === value[0] &&
          _max.getMonth() === value[1] &&
          _max.getDate() === value[2]
        ) {
          nT = _max.getHours()
        }
        break
      case 4:
        n0 = 0
        nT = 59

        if (
          _min.getFullYear() === value[0] &&
          _min.getMonth() === value[1] &&
          _min.getDate() === value[2] &&
          _min.getHours() === value[3]
        ) {
          n0 = _min.getMinutes()
        }

        if (
          _max.getFullYear() === value[0] &&
          _max.getMonth() === value[1] &&
          _max.getDate() === value[2] &&
          _max.getHours() === value[3]
        ) {
          nT = _max.getMinutes()
        }
        break
      case 5:
        n0 = 0
        nT = 59

        if (
          _min.getFullYear() === value[0] &&
          _min.getMonth() === value[1] &&
          _min.getDate() === value[2] &&
          _min.getHours() === value[3] &&
          _min.getMinutes() === value[4]
        ) {
          n0 = _min.getSeconds()
        }

        if (
          _max.getFullYear() === value[0] &&
          _max.getMonth() === value[1] &&
          _max.getDate() === value[2] &&
          _max.getHours() === value[3] &&
          _max.getMinutes() === value[4]
        ) {
          nT = _max.getSeconds()
        }
        break
      default:
        return []
    }

    return Array.from({ length: nT - n0 + 1 }, (_, i) => ({
      value: i + n0,
      label: labelFunc?.(i + n0),
    }))
  }

  $effect(() => {
    const valid = D.isValid(value)

    untrack(() => {
      pickerValue = toPickerValue(value)
      handleChange(valid ? pickerValue : [])
    })
  })

  function handleOk() {
    visible = false
    handleChange(pickerValue)
  }

  function handleClear() {
    visible = false
    handleChange([])
  }

  function handleChange(val: number[]) {
    let newVal: Date | undefined

    if (!val.length) {
      newVal = undefined
    } else {
      const [year, month = 0, day = 1, ...rest] = val
      const [hours = 0, minutes = 0, seconds = 0] = rest
      newVal = new Date(year, month, day, hours, minutes, seconds, 0)
    }

    if (!D.hasChanged(value, newVal)) return

    value = newVal
    onChange?.(newVal)
  }

  let isClearDisabled = $derived(!D.isValid(value))
</script>

{#if formItem}
  <div class="sunp-picker-input" class:sunp-picker-input-disabled={disabled}>
    {#if !value}
      <span class="sunp-form-item__placeholder">{placeholder}</span>
    {:else if typeof display === 'function'}
      {@render display(value)}
    {:else if D.isValid(value)}
      {D.toString(precision, value)}
    {/if}
  </div>
{/if}

<PickerBase bind:visible {...props} {isClearDisabled} onOk={handleOk} onClear={handleClear}>
  <PickerView bind:value={pickerValue} {columns} {loader} />
</PickerBase>
