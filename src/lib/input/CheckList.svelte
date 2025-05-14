<script lang="ts" module>
  import './CheckList.css'

  import { getContext, setContext, untrack, type Snippet } from 'svelte'
  import List from '../display/List.svelte'
  import Checkbox from './Checkbox.svelte'
  import { type HTMLAttributes } from 'svelte/elements'
  import { type FormItemContext } from './FormItem.svelte'

  export interface CheckListAttributes extends HTMLAttributes<EventTarget> {
    /** 选中的选项 */
    value?: PropertyKey | PropertyKey[]
    /** 标题 */
    header?: string | Snippet
    /** 是否允许多选 */
    multiple?: boolean
    /** 全选按钮。仅多选模式。提供 string 类型可自定义文本 */
    selectAll?: boolean | string
    /** 整组失效 */
    disabled?: boolean
    /** 变更事件 */
    onChange?: (value: PropertyKey | PropertyKey[] | undefined) => void
  }

  /** 复选框组上下文信息 */
  export interface CheckListContext {
    /** 注册 */
    register: (
      value: PropertyKey,
      input: HTMLInputElement,
      check: (chedked: boolean) => void
    ) => void
    /** 注销 */
    unregister: (value: PropertyKey) => void
    /** 数据变更事件 */
    onChange: (value: PropertyKey, checked: boolean) => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable<PropertyKey | PropertyKey[] | undefined>(),
    disabled = false,
    header,
    multiple = false,
    selectAll = false,
    children,
    onChange: _onChange,
    ...props
  }: CheckListAttributes = $props()

  let all = $derived(!selectAll ? undefined : typeof selectAll === 'string' ? selectAll : '全选')
  let allChecked = $state(false)
  let allIndeterminate = $state(false)

  let formItem = getContext<FormItemContext>('sun_parakeet_form_item')

  let registered = new Map<
    PropertyKey,
    { input: HTMLInputElement; check: (checked: boolean) => void }
  >()

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
    onChange(val, checked) {
      if (multiple && Array.isArray(value)) {
        const current = value.filter(x => x !== val)
        value = checked ? [...current, val] : [...current]
      } else {
        value = checked ? val : undefined
      }

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
    value

    untrack(() => {
      if (multiple && !Array.isArray(value)) {
        value = []
      }

      if (selectAll && multiple && Array.isArray(value)) {
        const len = value.length
        allChecked = len === registered.size
        allIndeterminate = 0 < len && len < registered.size
      }

      for (let [k, v] of registered.entries()) {
        const checked = multiple && Array.isArray(value) ? value.indexOf(k) >= 0 : value === k
        if (checked === v.input.checked) continue

        v.check(checked)
      }
    })
  })
</script>

{#snippet headerRender()}
  {#if typeof header === 'string'}
    {header}
  {:else if typeof header === 'function'}
    {@render header()}
  {/if}
{/snippet}

{#snippet headerSnippet()}
  {#if multiple && selectAll}
    <div class="sunp-check-list__header">
      {@render headerRender()}
      <Checkbox
        class="sunp-check-list__select-all"
        checked={allChecked}
        indeterminate={allIndeterminate}
        onChange={handleSelectAll}>{all}</Checkbox
      >
    </div>
  {:else}
    {@render headerRender()}
  {/if}
{/snippet}

<List class="sunp-check-list" {...props} header={header || selectAll ? headerSnippet : undefined}>
  {@render children?.()}
</List>
