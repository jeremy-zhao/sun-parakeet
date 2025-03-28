<script lang="ts" module>
  import './PickerView.css'

  import { untrack, getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import PickerColumn, { type PickerItem } from './PickerColumn.svelte'

  /** 选择器视图属性 */
  export interface PickerViewAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 列的数量。默认为1 */
    columns?: number
    /** 选中项 */
    value?: unknown[]
    /** 所选项下一级的渲染函数 */
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
  let { class: clazz, columns = 1, value = $bindable([]), loader, onChange, ...props }: PickerViewAttributes = $props()

  // 至少有一列
  if (columns < 1) columns = 1

  let _init = false // 是否已经完成初始化
  let _values = $state<unknown[]>([]) // 当前值的快照
  let _loadings = $state(new Array(columns).fill(false)) // 每列的加载状态

  let __columns = $state(new Array<PickerItem[]>(columns)) // 本地的列数据
  let __pickerColumns = getContext<PickerItem[][] | undefined>('sun_parakeet_picker_columns') // 从 Picker 组件中继承的列数据
  let _columns = $derived(__pickerColumns ?? __columns) // 列数据

  // PickerColumn 组件 onChange 事件处理器
  async function handleChange(index: number, val: unknown) {
    if (_values![index] == val) return
    // console.log('[PickerView] onChange', index, val, _values[index])

    _values[index] = val
    const vals = [...value.slice(0, index), val]
    const newValue = await onChangeRec(vals)
    value = [...newValue]
    onChange?.(newValue)
  }

  // 判断异步执行中是否有变化
  function changed(vals: unknown[]) {
    if (!vals?.length) return false
    return vals.every((v, i) => _values[i] && _values[i] != v)
  }

  // 递归处理每列的变化。此函数信任 vals 中每个值在 _columns 对应的列中均存在
  async function onChangeRec(vals: unknown[]) {
    // 达到最大列数，重置快照，并返回 vals 作为递归结果
    if (vals.length == columns) {
      _values = vals
      return vals
    }

    // 加载下一列的数据
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

    // 异步过程中，如果快照有了变化，则忽略此次执行过程
    if (changed(vals)) return value

    _columns[vals.length] = items ?? []

    // 加载不到数据，重置快照，返回 vals 作为递归结果
    if (items.length == 0) {
      _values = vals
      return vals
    }

    // 取 value 下一个值
    let next = value?.[vals.length]

    // 校验 value 下一个值是否存在，并纠正
    if (!next || !items.find(x => x.value === next)) {
      next = items[0].value
      _values[vals.length] = next
    }

    // 递归
    return await onChangeRec([...vals, next])
  }

  // 用 arr1 和 arr2 逐条目对比，返回头部相同的部分
  function diff(arr1: unknown[], arr2: unknown[]) {
    const re = []

    for (let i = 0, len = arr1.length; i < len; i++) {
      re.push(arr1[i])
      if (arr1[i] != arr2[i]) return re
    }
  }

  async function makeChange(vals: unknown[]) {
    const newVal = await onChangeRec([])
    if (equals(newVal, value)) return

    value = [...newVal]
    onChange?.(newVal)
  }

  // 初始化
  function init() {
    if (_init) return false
    _init = true

    // console.log('[PickerView] value 初始化', $state.snapshot(value))

    _init = true
    makeChange([])
    return true
  }

  // 处理 value 变化
  $effect(() => {
    value ??= []

    untrack(() => {
      // 初始化
      if (init()) return

      // 未改变
      // console.log('[PickerView] value 后续改变', $state.snapshot(value))
      if (equals(value, _values)) return

      const change = diff(value, _values) ?? []
      // console.log('[PickerView] value 从外部改变', $state.snapshot(value), _values, change)
      _values = [...value]
      makeChange(change)
    })
  })
</script>

<div class="sun-parakeet-picker-view {clazz}" {...props}>
  {#each _columns as items, index (index)}
    <PickerColumn
      {items}
      value={_values[index]}
      loading={_loadings[index]}
      onChange={val => handleChange(index, val)}
    />
  {/each}
</div>
