<script lang="ts" module>
  import './PickerView.css'

  import { untrack } from 'svelte'
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
</script>

<script lang="ts">
  let { class: clazz, columns = 1, value = $bindable([]), loader, onChange, ...props }: PickerViewAttributes = $props()

  let _init = false
  let _values = $state<unknown[]>([])
  let _columns = $state(new Array(columns))
  let _loadings = $state(new Array(columns).fill(true))

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

    // 异步过程中如果有了变化，则忽略此次执行过程
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

  $effect(() => {
    if (!value) value = []

    if (!_init) {
      _init = true
      onChangeRec([]).then(v => (value = [...v]))
      return
    }

    const oldValue = untrack(() => [..._values])
    const newValue = value ?? []
    const change = diff(newValue, oldValue)
    if (!change) return
    // console.log('[PickerView] value 从外部改变', [...newValue], oldValue, change)

    untrack(() => (_values = [...newValue]))
    onChangeRec(change)
  })
</script>

<div class="sun-parakeet-picker-view {clazz}" {...props}>
  {#each _columns as items, index (index)}
    <PickerColumn
      {items}
      value={_values[index]}
      loading={_loadings[index]}
      onchange={val => handleChange(index, val)}
    />
  {/each}
</div>
