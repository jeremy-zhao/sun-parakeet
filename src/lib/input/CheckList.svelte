<script lang="ts" module>
  import './CheckList.css'

  import { getContext, setContext, untrack, type Snippet } from 'svelte'
  import List from '../display/List.svelte'
  import Checkbox from './Checkbox.svelte'
  import { type HTMLAttributes } from 'svelte/elements'
  import { type FormItemContext } from './FormItem.svelte'

  export interface CheckListAttributes extends HTMLAttributes<EventTarget> {
    /** 整组失效 */
    disabled?: boolean
    /** 标题 */
    header?: string | Snippet
    /** 全选按钮 */
    selectAll?: boolean | string
    /** 选中的选项 */
    value?: PropertyKey[]
    /** 变化时回调函数 */
    onChange?: (value: any[]) => void
  }

  /** 复选框组上下文信息 */
  export interface CheckListContext {
    /** 注册 */
    register: (value: PropertyKey, input: HTMLInputElement, check: (chedked: boolean) => void) => void
    /** 注销 */
    unregister: (value: PropertyKey) => void
    /** 数据变更事件 */
    onChange: () => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable([]),
    disabled = false,
    header,
    selectAll = false,
    children,
    onChange: _onChange,
    ...props
  }: CheckListAttributes = $props()

  // 全选 =====================================

  let all = $derived(!selectAll ? undefined : typeof selectAll === 'string' ? selectAll : '全选')
  let allChecked = $state(false)
  let allIndeterminate = $state(false)

  // FormItem 联动 ============================

  let formItem = getContext<FormItemContext>('sun_parakeet_form_item')

  // CheckListItem 联动 =======================

  let registered = new Map<PropertyKey, { input: HTMLInputElement; check: (checked: boolean) => void }>()

  let context = $state<CheckListContext>({
    register(value, input, check) {
      if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
        console.warn(
          '[CheckList]',
          'CheckListItem 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
          value
        )
        return
      }

      if (registered.has(value)) {
        console.warn('[CheckList]', 'CheckListItem 提供的 value 重复，将被忽略', value)
        return
      }

      registered.set(value, { input, check })
    },
    unregister(value) {
      registered.delete(value)
    },
    onChange() {
      const values = registered
        .entries()
        .filter(([_, v]) => v.input.checked)
        .map(([k, _]) => k)

      value = Array.from(values)

      _onChange?.(value)
      formItem?.onChange(value)
    },
  })

  setContext<CheckListContext>('sun_parakeet_check_list', context)

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

        // console.log('[CheckList]', '从外部改变', k, checked)
        v.check(checked)
      }
    })
  })
</script>

{#snippet headerSnippet()}
  {#if selectAll}
    <Checkbox
      class="sun-parakeet-check-list__select-all"
      checked={allChecked}
      indeterminate={allIndeterminate}
      onChange={handleSelectAll}
    >
      {#if typeof header === 'string'}
        <span>{header}</span>
      {:else if typeof header === 'function'}
        {@render header()}
      {/if}
      <span class="sun-parakeet-check-list__select-all-text">{all}</span>
    </Checkbox>
  {:else if typeof header === 'string'}
    {header}
  {:else if typeof header === 'function'}
    {@render header()}
  {/if}
{/snippet}

<List class="sun-parakeet-check-list" {...props} header={header || selectAll ? headerSnippet : undefined}>
  {@render children?.()}
</List>
