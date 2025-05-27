<script lang="ts" module>
  import './CalendarPicker.css'

  import { getContext, onMount, untrack, type Snippet } from 'svelte'
  import PickerBase, { type PickerBaseAttributes } from './PickerBase.svelte'
  import Calendar, { isSingleValue, isRangeValue } from './Calendar.svelte'
  import type { CalendarAttributes, CalendarPage, CalendarValue } from './Calendar.svelte'
  import { type FormItemContext } from './FormItem.svelte'
  import D from '../common/date'

  export type CalendarPickerAttributes = Omit<
    PickerBaseAttributes,
    'isOkDisabled' | 'isClearDisabled' | 'onOk' | 'onClose'
  > &
    Omit<CalendarAttributes, 'page' | 'header' | 'onChange' | 'onPageChange' | 'destroyOnClose'> & {
      /** 自定义日历头部 */
      calendarHeader?: Snippet<
        [
          /** 年 */
          year: number,
          /** 月 */
          month: number,
          /** 增加 */
          add: (val: number, unit: 'year' | 'month') => void,
          /** 判定按钮是否禁用 */
          isDisabled: (button: 'prev-year' | 'prev-month' | 'next-month' | 'next-year') => boolean,
        ]
      >
      /** 自定义内容显示。仅作为 FormItem 子元素时生效 */
      display?: Snippet<[CalendarValue]>
      /** 占位文本。仅作为 FormItem 子元素时生效 */
      placeholder?: string
      /** 是否只读。仅作为 FormItem 子元素时生效 */
      readonly?: boolean
      /** 是否禁用。仅作为 FormItem 子元素时生效 */
      disabled?: boolean
      /** 变更事件 */
      onChange?: (value: CalendarValue) => void
    }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    calendarHeader: header,
    placeholder = '请选择',
    display,
    readonly = false,
    disabled = false,
    onChange,
    mode = 'single',
    max,
    min,
    weekStartsOn = 'sunday',
    cell,
    visible = $bindable(false),
    class: clazz,
    ...props
  }: CalendarPickerAttributes = $props()

  const calendar = { mode, max, min, weekStartsOn, header, cell }

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

  let _page = $state<[year: number, month: number]>(initPage())

  function initPage(): CalendarPage {
    const date = D.isValid(value)
      ? value
      : Array.isArray(value) && D.isValid(value[0])
        ? value[0]
        : new Date()

    return [date.getFullYear(), date.getMonth()]
  }

  $effect(() => {
    if (visible) {
      untrack(() => (_page = initPage()))
    }
  })

  let _value = $state<CalendarValue>(value)

  function handleChange(newVal: CalendarValue) {
    _value = newVal
  }

  function handleOk() {
    value = _value
    visible = false
    onChange?.(value)
  }

  function handleClear() {
    value = mode === 'range' ? [] : undefined
    visible = false
    onChange?.(value)
  }

  $effect(() => {
    value
    untrack(() => (_value = value))
  })

  let isOkDisabled = $derived.by(() => {
    switch (mode) {
      case 'single':
        return _value == null
      case 'range':
        return !Array.isArray(_value) || _value[0] == null
      default:
        return true
    }
  })

  let isClearDisabled = $derived.by(() => {
    switch (mode) {
      case 'single':
        return value == null
      case 'range':
        return !Array.isArray(value) || value[0] == null
      default:
        return true
    }
  })
</script>

{#if formItem}
  <div class="sunp-calendar-picker-input" class:sunp-calendar-picker-input-disabled={disabled}>
    {#if (!value || (Array.isArray(value) && !value[0])) && placeholder}
      <span class="sunp-form-item__placeholder">{placeholder}</span>
    {:else if typeof display === 'function'}
      {@render display(value)}
    {:else if mode === 'single' && value && isSingleValue(value)}
      <span>{D.toString('day', value)}</span>
    {:else if mode === 'range' && isRangeValue(value) && value[0]}
      <span>{D.toString('day', value[0])}</span>
      {#if value[1]}
        <span>至</span>
        <span>{D.toString('day', value[1])}</span>
      {/if}
    {/if}
  </div>
{/if}

<PickerBase
  class="sunp-calendar-picker {clazz}"
  bind:visible
  {isOkDisabled}
  {isClearDisabled}
  {...props}
  onOk={handleOk}
  onClear={handleClear}
>
  <Calendar
    class="sunp-calendar-picker__calendar"
    bind:value={_value}
    bind:page={_page}
    onChange={handleChange}
    {...calendar}
  />
</PickerBase>
