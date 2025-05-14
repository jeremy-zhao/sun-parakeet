<script lang="ts" module>
  import './CheckboxGroup.css'

  import { getContext, setContext, untrack } from 'svelte'
  import Space, { type SpaceAttributes } from '../layout/Space.svelte'
  import Checkbox from './Checkbox.svelte'
  import { type FormItemContext } from './FormItem.svelte'

  export interface CheckboxGroupAttributes extends SpaceAttributes {
    /** 选中的选项 */
    value?: PropertyKey[]
    /** 全选按钮。提供 string 类型可自定义文本 */
    selectAll?: boolean | string
    /** 整组失效 */
    disabled?: boolean
    /** 变更事件 */
    onChange?: (value: PropertyKey[]) => void
  }

  /** 复选框组上下文信息 */
  export interface CheckboxGroupContext {
    /** 注册 */
    register: (
      value: PropertyKey,
      input: HTMLInputElement,
      check: (chedked: boolean) => void
    ) => void
    /** 注销 */
    unregister: (value: PropertyKey) => void
    /** 变更事件 */
    onChange: () => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }

  const SELECT_ALL_VALUE = '__sun_parakeet_checkbox_group_select_all__'
</script>

<script lang="ts">
  let {
    value = $bindable([]),
    selectAll = false,
    children,
    onChange: _onChange,
    direction = 'horizontal',
    wrap = false,
    ...props
  }: CheckboxGroupAttributes = $props()

  let all = $derived(!selectAll ? undefined : typeof selectAll === 'string' ? selectAll : '全选')
  let allChecked = $state(false)
  let allIndeterminate = $state(false)

  let formItem = getContext<FormItemContext>('sun_parakeet_form_item')

  let registered = new Map<
    PropertyKey,
    { input: HTMLInputElement; check: (checked: boolean) => void }
  >()

  let context = $state<CheckboxGroupContext>({
    register(value, input, check) {
      if (value === SELECT_ALL_VALUE) return

      if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
        console.warn(
          '[CheckboxGroup]',
          'Checkbox 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
          value
        )
        return
      }

      if (registered.has(value)) {
        console.warn('[CheckboxGroup]', 'Checkbox 提供的 value 重复，将被忽略', value)
        return
      }

      registered.set(value, { input, check })
    },
    unregister(value) {
      registered.delete(value)
    },
    onChange() {
      const values = [...registered.entries()]
        .filter(([_, v]) => v.input.checked)
        .map(([k, _]) => k)

      value = Array.from(values)

      _onChange?.(value)
      formItem?.onChange(value)
    },
  })

  setContext<CheckboxGroupContext>('sun_parakeet_checkbox_group', context)

  function handleSelectAll(checked: boolean) {
    for (let [_, v] of registered) {
      if (v.input.checked === checked) continue
      v.input.click()
    }
  }

  $effect(() => {
    const values = [...value]

    untrack(() => {
      allChecked = values.length === registered.size
      allIndeterminate = 0 < values.length && values.length < registered.size

      for (let [k, v] of registered.entries()) {
        const checked = values.indexOf(k) >= 0
        if (checked === v.input.checked) continue

        v.check(checked)
      }
    })
  })
</script>

<Space class="sunp-checkbox-group" {direction} {wrap} {...props}>
  {#if selectAll}
    <Checkbox
      checked={allChecked}
      indeterminate={allIndeterminate}
      value={SELECT_ALL_VALUE}
      onChange={handleSelectAll}>{all}</Checkbox
    >
  {/if}
  {@render children?.()}
</Space>
