<script lang="ts" module>
  import './Input.css'
  import CloseIcon from '../icons/close-circle-fill.svg?raw'

  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
  import { onMount } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  /** 输入框类型 */
  export type InputTypeAttribute = 'email' | 'number' | 'password' | 'tel' | 'text' | 'url'

  /** 输入框属性 */
  export interface InputAttributes extends HTMLInputAttributes {
    /** 输入值 */
    value?: string
    /** 输入框类型。HTML input 标签 type 属性的子集 */
    type?: InputTypeAttribute
    /** 是否渲染为块级元素 */
    block?: boolean
    /** 是否启用清除图标？点击清除图标后会清空输入框 */
    clearable?: boolean
    /** 输入框内容变化时触发 */
    onChange?: (value: string) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(''),
    type = 'text',
    block = false,
    clearable = false,
    onChange,
    class: clazz,
    style,
    disabled,
    ...props
  }: InputAttributes = $props()

  let input: HTMLInputElement

  function handleChange() {
    onChange?.(value)
  }

  function handleClear() {
    value = ''
    handleChange()
  }

  onMount(() => {
    input.addEventListener('input', handleChange)
  })
</script>

<div
  class="sunp-input {clazz}"
  class:sunp-input-block={block}
  class:sunp-input-disabled={disabled}
  {style}
>
  <input bind:this={input} bind:value class="sunp-input__element" type="" {disabled} {...props} />
  {#if clearable && value?.length}
    <Button color="clear" onclick={handleClear} block>
      <Icon size={22} svg={CloseIcon} />
    </Button>
  {/if}
</div>
