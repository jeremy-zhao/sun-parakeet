<script lang="ts" module>
  import './Calendar.css'
  import ArrowLeftD from '../icons/arrow-left-double-line.svg?raw'
  import ArrowLeftS from '../icons/arrow-left-s-line.svg?raw'
  import ArrowRightS from '../icons/arrow-right-s-line.svg?raw'
  import ArrowRightD from '../icons/arrow-right-double-line.svg?raw'

  import { untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
  import D from '../common/date'

  const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']

  /** 日历页 */
  export type CalendarPage = [
    /** 年 */
    year: number,
    /** 月。从 0 开始计数 */
    month: number,
  ]

  export type CalendarSingleValue = Date | undefined
  export type CalendarRangeValue = [begin?: Date, end?: Date]
  export type CalendarValue = CalendarSingleValue | CalendarRangeValue

  export function isSingleValue(value: CalendarValue): value is CalendarSingleValue {
    return value == null || D.isValid(value)
  }

  export function isRangeValue(value: CalendarValue): value is CalendarRangeValue {
    return Array.isArray(value) && isSingleValue(value[0]) && isSingleValue(value[1])
  }

  /** 日历 */
  export interface CalendarAttributes extends HTMLAttributes<EventTarget> {
    /** 选择模式。默认值 'single' */
    mode?: 'single' | 'range'
    /** 选中的日期。'single' => Date, 'range' => [Date, Date] */
    value?: CalendarValue
    /** 选中的年月 */
    page?: CalendarPage
    /** 最大值 */
    max?: Date
    /** 最小值 */
    min?: Date
    /** 每周以周几作为第一天 */
    weekStartsOn?: 'sunday' | 'monday'
    /** 自定义头部 */
    header?: Snippet<
      [
        /** 年 */
        year: number,
        /** 月 */
        month: number,
        /** 增加 */
        add: (value: number, unit: 'year' | 'month') => void,
        /** 判定按钮是否禁用 */
        isDisabled: (button: 'prev-year' | 'prev-month' | 'next-month' | 'next-year') => boolean,
      ]
    >
    /** 自定义日期单元格 */
    cell?: Snippet<[date: Date]>
    /** 变更事件 */
    onChange?: (value: CalendarValue) => void
    /** 年月变更事件 */
    onPageChange?: (page?: CalendarPage) => void
  }
</script>

<script lang="ts">
  let {
    mode = 'single',
    value = $bindable(),
    page = $bindable(initPage()),
    max,
    min,
    weekStartsOn = 'sunday',
    header,
    cell,
    onChange,
    onPageChange,
    class: clazz,
    ...props
  }: CalendarAttributes = $props()

  let days = $derived(weekStartsOn === 'sunday' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0])

  let dates = $derived.by(() => {
    const d0 = new Date(page[0], page[1], 1)

    let dayOfWeek = d0.getDay()

    if (weekStartsOn === 'monday' && dayOfWeek === 0) {
      dayOfWeek = 7
    }

    d0.setDate(1 - (weekStartsOn === 'sunday' ? dayOfWeek : dayOfWeek - 1))

    if (d0.getDate() == 1) {
      d0.setDate(-6)
    }

    const re = Array.from({ length: 7 * 6 }).map((_, ix) => {
      const date = new Date(d0)
      date.setDate(d0.getDate() + ix)
      return date
    })

    return re
  })

  function initPage(): CalendarPage {
    const date = D.isValid(value)
      ? value
      : Array.isArray(value) && D.isValid(value[0])
        ? value[0]
        : new Date()

    return [date.getFullYear(), date.getMonth()]
  }

  function add(val: number, unit: 'year' | 'month') {
    const date = new Date(
      page[0] + (unit === 'year' ? val : 0),
      page[1] + (unit === 'month' ? val : 0),
      1
    )

    setPage(date.getFullYear(), date.getMonth())
  }

  function isPageMonth(date: Date) {
    return date.getFullYear() === page[0] && date.getMonth() === page[1]
  }

  function setPage(year: number, month: number) {
    if (page[0] === year && page[1] === month) return

    const dm = new Date(year, month, 1)

    if (D.isValid(min) && D.diff('day', min, dm) < 0) {
      year = min.getFullYear()
      month = min.getMonth()
    } else if (D.isValid(max) && D.diff('day', dm, max) < 0) {
      year = max.getFullYear()
      month = max.getMonth()
    }

    if (page[0] === year && page[1] === month) return

    page = [year, month]
    onPageChange?.([year, month])
  }

  function handleClick(date: Date) {
    switch (mode) {
      case 'single':
        handleClickSingle(date)
        break
      case 'range':
        handleClickRange(date)
        break
    }
  }

  function handleClickSingle(date: Date) {
    if (D.hasChanged(value, date)) {
      value = date
    } else {
      value = undefined
    }

    onChange?.(value)
  }

  function handleClickRange(date: Date) {
    const [first, last] = Array.isArray(value) ? value : []

    if ((first && last) || !first) {
      value = [date]
    } else if (first < date) {
      value = [first, date]
    } else if (first > date) {
      value = [date, first]
    } else {
      value = []
    }

    onChange?.(value)
  }

  function validate(value: CalendarValue) {
    switch (mode) {
      case 'single':
        return isSingleValue(value)
      case 'range':
        return isRangeValue(value)
      default:
        return true
    }
  }

  $effect(() => {
    if (!validate(value)) {
      console.error('[SunParakeet:Calendar] 无效的 value', value)
      return
    }

    untrack(() => {
      switch (mode) {
        case 'single':
          if (value && isSingleValue(value)) {
            setPage(value.getFullYear(), value.getMonth())
          }
          break
        case 'range':
          if (!isRangeValue(value)) return
          const [begin, end] = value

          if (D.isValid(end)) {
            setPage(end.getFullYear(), end.getMonth())
          } else if (D.isValid(begin)) {
            setPage(begin.getFullYear(), begin.getMonth())
          }
          break
      }
    })
  })

  function isDisabled(button: 'prev-year' | 'prev-month' | 'next-month' | 'next-year') {
    let year: number, month: number

    switch (button) {
      case 'prev-year':
        return D.isValid(min) && page[0] <= min.getFullYear()
      case 'prev-month':
        if (!D.isValid(min)) return false
        year = min.getFullYear()
        if (page[0] > year) return false
        if (page[0] < year) return true
        month = min.getMonth()
        return page[1] <= month
      case 'next-month':
        if (!D.isValid(max)) return false
        year = max.getFullYear()
        if (page[0] < year) return false
        if (page[0] > year) return true
        month = max.getMonth()
        return page[1] >= month
      case 'next-year':
        return D.isValid(max) && page[0] >= max.getFullYear()
    }

    return false
  }

  function isSelected(date: Date) {
    switch (mode) {
      case 'single':
        return D.isValid(value) && D.isSame('day', date, value)
      case 'range':
        if (!Array.isArray(value)) return false

        const [first, last] = value

        if (D.isValid(first) && D.isValid(last)) {
          return first <= date && date <= last
        } else if (D.isValid(first)) {
          return D.isSame('day', date, first)
        } else {
          return false
        }
    }

    return false
  }

  function isSelectedBegin(date: Date) {
    switch (mode) {
      case 'single':
        return D.isValid(value) && D.isSame('day', date, value)
      case 'range':
        if (!Array.isArray(value)) return false

        const [first, _] = value
        return D.isValid(first) && D.isSame('day', date, first)
    }

    return false
  }

  function isSelectedEnd(date: Date) {
    switch (mode) {
      case 'single':
        return D.isValid(value) && D.isSame('day', date, value)
      case 'range':
        if (!Array.isArray(value)) return false

        const [first, last] = value

        if (first && D.isValid(last)) {
          return D.isSame('day', date, last)
        } else if (D.isValid(first)) {
          return D.isSame('day', date, first)
        } else {
          return false
        }
    }

    return false
  }
</script>

<div class="sunp-calendar sunp-calendar-{mode} {clazz}" {...props}>
  {#if typeof header === 'function'}
    {@render header(page[0], page[1], add, isDisabled)}
  {:else}
    <header class="sunp-calendar__header">
      <Button
        color="calendar-header-action"
        --sunp-border="0px"
        disabled={isDisabled('prev-year')}
        onclick={() => add(-1, 'year')}
      >
        <Icon svg={ArrowLeftD} size={28} />
      </Button>
      <Button
        color="calendar-header-action"
        --sunp-border="0px"
        onclick={() => add(-1, 'month')}
        disabled={isDisabled('prev-month')}
      >
        <Icon svg={ArrowLeftS} size={28} />
      </Button>
      <span class="sunp-calendar__header-title">{page[0]}年{page[1] + 1}月</span>
      <Button
        color="calendar-header-action"
        --sunp-border="0px"
        onclick={() => add(1, 'month')}
        disabled={isDisabled('next-month')}
      >
        <Icon svg={ArrowRightS} size={28} />
      </Button>
      <Button
        color="calendar-header-action"
        --sunp-border="0px"
        onclick={() => add(1, 'year')}
        disabled={isDisabled('next-year')}
      >
        <Icon svg={ArrowRightD} size={28} />
      </Button>
    </header>
  {/if}

  <div class="sunp-calendar__marks">
    {#each days as day}
      <div class="sunp-calendar__mark">{DAY_NAMES[day]}</div>
    {/each}
  </div>

  <div class="sunp-calendar__cells">
    {#each dates as date}
      <button
        class="sunp-calendar__cell"
        class:sunp-calendar__cell-today={D.isSame('day', date, new Date())}
        class:sunp-calendar__cell-selected={isSelected(date)}
        class:sunp-calendar__cell-selected-begin={isSelectedBegin(date)}
        class:sunp-calendar__cell-selected-end={isSelectedEnd(date)}
        class:sunp-calendar__cell-other-month={!isPageMonth(date)}
        class:sunp-calendar__cell-disabled={(min && date < min) || (max && date > max)}
        onclick={() => handleClick(date)}
        disabled={(min && date < min) || (max && date > max)}
      >
        {#if typeof cell === 'function'}
          {@render cell(date)}
        {:else}
          {date.getDate()}
        {/if}
      </button>
    {/each}
  </div>
</div>
