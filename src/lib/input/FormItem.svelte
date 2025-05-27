<script lang="ts" module>
  import './FormItem.css'
  import ArrowIcon from '../icons/arrow-right-s-line.svg?raw'

  import { getContext, onMount, setContext, untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'
  import type { FormContext, FormItemValidation } from './Form.svelte'

  /**
   * 自定义表单条目的校验逻辑
   * @param val 当前表单的值
   * @returns 如果返回值的类型为 string，且截断前后空白后字符串长度 > 0，则表示未通过验证
   */
  export type Rule = (val: any) => any | Promise<any>

  /** 表单条目属性 */
  export interface FormItemAttributes extends HTMLAttributes<EventTarget> {
    /** 标签名 */
    label?: string | Snippet
    /** 布局模式 */
    layout?: 'horizontal' | 'vertical'
    /** 提供表单条目对应的字段 */
    field?: PropertyKey
    /** 是否必填 */
    required?: boolean | string | Rule
    /** 自定义校验逻辑 */
    rules?: Array<Rule>
    /** 表单条目错误信息 */
    error?: string
    /** 是否可以点击 */
    clickable?: boolean | 'auto'
    /** 点击事件 */
    onClick?: () => void
  }

  /** 表单条目上下文信息 */
  export interface FormItemContext {
    /** 表单控件点击事件 */
    onClick?: () => void
  }
</script>

<script lang="ts">
  let {
    label,
    layout,
    field,
    required = false,
    rules,
    error = $bindable(),
    clickable = 'auto',
    onClick,
    children,
    class: clazz,
    ...props
  }: FormItemAttributes = $props()

  let _self: HTMLDivElement
  let content: HTMLDivElement

  let context = $state<FormItemContext>({})
  setContext<FormItemContext>('sun_parakeet_form_item', context)

  let form = getContext<FormContext | undefined>('sun_parakeet_form')

  let _layout = $derived(layout ?? form?.layout ?? 'vertical')

  const validation: FormItemValidation = {
    validate,
    reset,
  }

  onMount(() => {
    form?.register(validation)
    return () => form?.unregister(validation)
  })

  function onButton(node: HTMLButtonElement) {
    node.prepend(content)
    node.style.display = 'flex'

    return {
      destroy() {
        _self.appendChild(content)
      },
    }
  }

  function handleClick() {
    context.onClick?.()
    onClick?.()
  }

  let init = false

  /** 执行验证 */
  async function validate() {
    try {
      error = (await checkRequired()) || (await checkRules())
    } catch (ex) {
      console.warn(ex)
    }

    return !error
  }

  /** 重置验证 */
  function reset() {
    init = false
    error = undefined
  }

  function getValue() {
    if (!required && !rules?.length) return

    if (form == null) {
      throw '[SunParakeet:FormItem] FormItem 必须为 Form 的子元素，否则无法进行规则校验'
    }

    if (form.data == null) {
      throw '[SunParakeet:Form] 未提供 data，无法进行规则校验'
    }

    if (field == null) {
      throw '[SunParakeet:FormItem] 未提供 field，无法进行规则校验'
    }

    return form.data[field]
  }

  async function checkRequired() {
    if (!required) return

    const value = getValue()

    if (typeof required === 'function') {
      return await checkRule(required, value)
    }

    let msg = typeof required === 'string' && required.length ? required : undefined

    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return msg ?? '必填'
    } else if (typeof value === 'number' && isNaN(value)) {
      return msg ?? '请输入有效数字'
    } else if (value instanceof Date && isNaN(value.getTime())) {
      return msg ?? '请输入有效日期'
    }
  }

  async function checkRule(rule: Rule, value: unknown) {
    if (typeof rule !== 'function') return

    let msg = await rule(value)

    if (typeof msg === 'string') {
      msg = msg.trim()
    }

    return msg
  }

  async function checkRules() {
    if (!Array.isArray(rules) || !rules.length) return

    const value = getValue()

    for (let rule of rules) {
      const msg = await checkRule(rule, value)

      if (typeof msg === 'string' && msg.length) {
        return msg
      }
    }
  }

  $effect(() => {
    try {
      getValue()
    } catch (ex) {
      console.warn(ex)
      return
    }

    untrack(() => {
      if (!init) {
        init = true
        return
      }

      validate()
    })
  })
</script>

<div bind:this={_self} class="sunp-form-item sunp-form-item-{_layout} {clazz}" {...props}>
  {#if required}
    <b class="sunp-form-item__required">*</b>
  {/if}

  <div bind:this={content} class="sunp-form-item__content">
    {#if label && typeof label === 'string'}
      <div class="sunp-form-item__label">
        {label}
      </div>
    {:else if label && typeof label === 'function'}
      <div class="sunp-form-item__label">
        {@render label()}
      </div>
    {/if}

    <div class="sunp-form-item__input">
      {@render children?.()}
      {#if error}
        <p class="sunp-form-item__error">{error}</p>
      {/if}
    </div>
  </div>

  {#if clickable === true || (clickable === 'auto' && typeof context.onClick === 'function')}
    <button use:onButton class="sunp-form-item-button" onclick={handleClick}>
      <Icon class="sunp-form-item-button__arrow" svg={ArrowIcon} size={30} />
    </button>
  {/if}
</div>
