<script lang="ts" module>
  import './PickerView.css'

  import { untrack, getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PickerColumn, { type PickerItem } from './PickerColumn.svelte'

  /** 选择器视图属性 */
  export interface PickerViewAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 选中项 */
    value?: unknown[]
    /** 列的数量。默认为1 */
    columns?: number
    /** 所选项下一级的加载函数 */
    loader: (value: any[]) => (string | PickerItem)[] | Promise<(string | PickerItem)[]>
    /** 内容改变事件 */
    onChange?: (value: any[]) => void
  }

  /** 判断两个数组是否一致 */
  export function equals(arr1: unknown[], arr2: unknown[]) {
    if (arr1.length !== arr2.length) return false
    return arr1.every((val, ix) => arr2[ix] === val)
  }
</script>

<script lang="ts">
  let {
    value = $bindable([]),
    columns = 1,
    loader,
    onChange,
    class: clazz,
    ...props
  }: PickerViewAttributes = $props()

  if (columns < 1) columns = 1

  let _init = false // 是否已经完成初始化
  let _values = $state<unknown[]>([]) // 当前值的快照
  let _loadings = $state(new Array(columns).fill(false)) // 每列的加载状态

  let __columns = $state(new Array<PickerItem[]>(columns)) // 本地的列数据
  let __pickerColumns = getContext<PickerItem[][] | undefined>('sun_parakeet_picker_columns') // 从 Picker 组件中继承的列数据
  let _columns = $derived(__pickerColumns ?? __columns) // 列数据

  async function handleChange(index: number, val: unknown) {
    if (_values![index] == val) return
    _values[index] = val
    const vals = [...value.slice(0, index), val]
    const newValue = await onChangeRec(vals)
    value = [...newValue]
    onChange?.(newValue)
  }

  function changed(vals: unknown[]) {
    if (!vals?.length) return false
    return vals.every((v, i) => _values[i] && _values[i] != v)
  }

  async function onChangeRec(vals: unknown[]) {
    if (vals.length == columns) {
      _values = vals
      return vals
    }

    let items0 = loader(vals)

    if (items0 instanceof Promise) {
      _loadings[vals.length] = true
      items0 = await items0
    }

    const items = items0
      .map(x => {
        if (typeof x === 'object') {
          return x
        } else if (typeof x === 'string') {
          return { value: x }
        }
      })
      .filter(x => x) as PickerItem[]

    _loadings[vals.length] = false

    if (changed(vals)) return value

    _columns[vals.length] = items ?? []

    if (items.length == 0) {
      _values = vals
      return vals
    }

    let next = value?.[vals.length]

    if (!next || !items.find(x => x.value === next)) {
      next = items[0].value
      _values[vals.length] = next
    }

    return await onChangeRec([...vals, next])
  }

  function diff(arr1: unknown[], arr2: unknown[]) {
    const re = []

    for (let i = 0, len = arr1.length; i < len; i++) {
      re.push(arr1[i])
      if (arr1[i] != arr2[i]) return re
    }
  }

  async function makeChange(vals: unknown[]) {
    const newVal = await onChangeRec(vals)
    if (equals(newVal, value)) return

    value = [...newVal]
    onChange?.(newVal)
  }

  function init() {
    if (_init) return false
    _init = true
    makeChange([])
    return true
  }

  $effect(() => {
    value ??= []

    untrack(() => {
      if (init()) return

      if (equals(value, _values)) return

      const change = diff(value, _values) ?? []
      _values = [...value]
      makeChange(change)
    })
  })
</script>

<div class="sunp-picker-view {clazz}" {...props}>
  {#each _columns as items, index (index)}
    <PickerColumn
      {items}
      value={_values[index]}
      loading={_loadings[index]}
      onChange={val => handleChange(index, val)}
    />
  {/each}
</div>
