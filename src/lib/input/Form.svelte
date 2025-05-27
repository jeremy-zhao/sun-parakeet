<script lang="ts" module>
  import './Form.css'

  import { onMount, setContext, type Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'
  import FormHeader from './FormHeader.svelte'

  /** 表单属性 */
  export interface FormAttributes extends HTMLFormAttributes {
    /** 标题 */
    header?: string | Snippet
    /** 布局模式 */
    layout?: 'horizontal' | 'vertical'
    /** 表单对象 */
    data?: Record<PropertyKey, any>
  }

  /** 表单条目验证 */
  export interface FormItemValidation {
    validate: () => Promise<boolean>
    reset: () => void
  }

  /** 表单上下文信息 */
  export interface FormContext {
    /** 布局模式 */
    layout?: 'horizontal' | 'vertical'
    /** 表单对象 */
    data?: Record<PropertyKey, any>
    /** 注册表单条目 */
    register: (formItem: FormItemValidation) => void
    /** 注销表单条目 */
    unregister: (formitem: FormItemValidation) => void
  }
</script>

<script lang="ts">
  let {
    header,
    layout = 'vertical',
    data: _data = $bindable(),
    children,
    ...props
  }: FormAttributes = $props()

  let formItems = $state<Set<FormItemValidation>>(new Set())

  let context = $state<FormContext>({
    layout,
    data: _data,
    register(formItem) {
      formItems.add(formItem)
    },
    unregister(formItem) {
      formItems.delete(formItem)
    },
  })

  setContext<FormContext>('sun_parakeet_form', context)

  $effect(() => {
    if (layout !== context.layout) {
      context.layout = layout
    }
  })

  $effect(() => {
    if (_data !== context.data) {
      context.data = _data
    }
  })

  onMount(() => {
    return () => {
      formItems.clear()
    }
  })

  /**
   * 表单验证 (异步)
   * @returns 表单是否有效
   */
  export async function validate() {
    let re = true

    for (let item of formItems) {
      const valid = await item.validate()

      if (!valid) {
        re = false
      }
    }

    return re
  }

  /**
   * 表单数据重置，并清除验证错误
   * @param data 用于重置表单的对象
   */
  export function reset(data: Record<PropertyKey, any>) {
    if (typeof data !== 'object') {
      throw new Error('[SunParakeet:Form.reset] Invalid data')
    }

    for (let item of formItems) {
      item.reset()
    }

    _data = data
  }
</script>

<form class="sunp-form" {...props} onsubmit={e => e.preventDefault()}>
  {#if typeof header === 'string'}
    <FormHeader>{header}</FormHeader>
  {:else if typeof header === 'function'}
    <FormHeader>{@render header()}</FormHeader>
  {/if}

  {@render children?.()}
</form>
