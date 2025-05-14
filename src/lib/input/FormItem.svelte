<script lang="ts" module>
  import './FormItem.css'
  import ArrowIcon from '../icons/arrow-right-s-line.svg?raw'

  import { setContext, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { validate, type Rule } from './validation'
  import Icon from '../common/Icon.svelte'

  /** 表单条目属性 */
  export interface FormItemAttributes extends HTMLAttributes<EventTarget> {
    /** 标签名 */
    label?: string | Snippet
    /** 指定输入框的 id。如果不填，会尝试自动匹配 */
    for?: string
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
    /** 数据变更事件 */
    onChange: (value: unknown) => void
    /** 重置 */
    onReset: () => void
    /** 点击事件 */
    onClick?: () => void
  }
</script>

<script lang="ts">
  let {
    label,
    for: labelFor,
    rules,
    children,
    class: clazz,
    ...props
  }: FormItemAttributes = $props()

  let content: HTMLDivElement

  let registered: FormItemControl[] = []
  let input: FormItemControl | null | undefined

  let required = $derived(!!rules?.find(x => x.required))
  let error = $state<string | undefined>()

  function init() {
    if (input) {
      input = null
    }

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

  }

  let context = $state<FormItemContext>({
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
    onReset() {
      error = undefined
    },
  })

  setContext<FormItemContext>('sun_parakeet_form_item', context)

  function onButton(node: HTMLButtonElement) {
    node.prepend(content)
  }
</script>

<div class="sunp-form-item {clazz}" {...props}>
  {#if required}
    <b class="sunp-form-item__required">*</b>
  {/if}

  <div bind:this={content} class="sunp-form-item__content">
    {#if label && typeof label === 'string'}
      <label class="sunp-form-item__label" for={labelFor}>
        {label}
      </label>
    {:else if label && typeof label === 'function'}
      <label class="sunp-form-item__label" for={labelFor}>
        {@render label()}
      </label>
    {/if}

    <div class="sunp-form-item__input">
      {@render children?.()}
      {#if error}
        <p class="sunp-form-item__error">{error}</p>
      {/if}
    </div>
  </div>

  {#if typeof context.onClick === 'function'}
    <button use:onButton class="sunp-form-item-button" onclick={context.onClick}>
      <Icon class="sunp-form-item-button__arrow" svg={ArrowIcon} size={30} />
    </button>
  {/if}
</div>
