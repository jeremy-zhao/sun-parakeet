<script lang="ts" module>
  import './Input.css'

  import CloseIcon from '../icons/close-circle-fill.svg?raw'

  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'

  import { getContext, onMount } from 'svelte'

  import type { HTMLInputAttributes } from 'svelte/elements'
  import type { FormItemContext } from './FormItem.svelte'

  /** 输入框类型 */
  export type InputTypeAttribute = 'number' | 'password' | 'text'

  /** 输入框属性 */
  export interface InputAttributes extends HTMLInputAttributes {
    /** 是否启用清除图标？点击清除图标后会清空输入框 */
    clearable?: boolean
    /** 输入框类型。HTML input 标签 type 属性的子集 */
    type?: InputTypeAttribute
    /** 输入值 */
    value?: string
    /** 输入框内容变化时触发 */
    onChange?: (value: string) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(''),
    clearable = false,
    type = 'text',
    placeholder = '请输入内容',
    onChange,
    class: clazz,
    autocomplete,
    ...props
  }: InputAttributes = $props()

  let formItem = getContext<FormItemContext>('sun_parakeet_form_item')

  let input: HTMLInputElement

  function handleChange() {
    onChange?.(value)
    formItem?.onChange(value)
  }

  function handleClear() {
    value = ''
    handleChange()
  }

  onMount(() => {
    input.addEventListener('input', handleChange)

    formItem?.register(input)

    return () => {
      formItem?.unregister(input)
    }
  })
</script>

<div class="sun-parakeet-input">
  <input bind:this={input} bind:value class="sun-parakeet-input-element {clazz}" {type} {placeholder} {...props} />
  {#if clearable && value?.length}
    <Button class="sun-parakeet-input__button" color="text" onclick={handleClear}>
      <Icon size={22} svg={CloseIcon} />
    </Button>
  {/if}
</div>
