<script lang="ts" module>
  import './FormItem.css'

  import { setContext, type Snippet } from 'svelte'
  import { validate, type Rule } from './validation'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 表单条目属性 */
  export interface FormItemAttributes extends HTMLAttributes<EventTarget> {
    /** 指定输入框的 id。如果不填，会尝试自动匹配 */
    for?: string
    /** 标签名 */
    label?: string | Snippet
    /** 校验规则 */
    rules?: Rule[]
  }

  /** FormItem 支持的控件类型 */
  export type FormItemControl = HTMLInputElement | HTMLTextAreaElement

  /** 表单条目上下文信息 */
  export interface FormItemContext {
    /** 注册 */
    register: (input: FormItemControl) => void
    /** 注销 */
    unregister: (input: FormItemControl) => void
    /** 数据变更 */
    onChange: (value: unknown) => void
  }
</script>

<script lang="ts">
  let { label, for: labelFor, rules, children, ...props }: FormItemAttributes = $props()

  let registered: FormItemControl[] = []
  let input: FormItemControl | null | undefined

  let required = $derived(!!rules?.find(x => x.required))
  let error = $state<string | undefined>()

  function init() {
    // TODO 卸载
    if (input) {
      input = null
    }

    // 加载
    if (labelFor) {
      input = registered.find(x => x.id === labelFor)
    } else {
      for (let el of registered) {
        if (!el.id) continue
        input = el
      }

      if (!input) {
        input = registered[0]
      }
    }

    if (!input) return

    // TODO 初始化
    console.log('init', input)
  }

  setContext<FormItemContext>('sun_parakeet_form_item', {
    register(el) {
      if (!el) return
      registered.push(el)
      if (input) return
      init()
    },
    unregister(el) {
      if (!el) return
      registered = registered.filter(x => x !== el)
      if (input !== el) return
      init()
    },
    onChange(value: unknown) {
      if (rules?.length) {
        error = validate(rules, value)
      }
    },
  })
</script>

<div class="sun-parakeet-form-item" {...props}>
  {#if required}
    <b class="sun-parakeet-form-item__required">*</b>
  {/if}

  {#if label && typeof label === 'string'}
    <label class="sun-parakeet-form-item__label" for={labelFor}>
      {label}
    </label>
  {:else if label && typeof label === 'function'}
    <label class="sun-parakeet-form-item__label" for={labelFor}>
      {@render label()}
    </label>
  {/if}

  <div class="sun-parakeet-form-item__input">
    {@render children?.()}
    {#if error}
      <p class="sun-parakeet-form-item__error">{error}</p>
    {/if}
  </div>
</div>
