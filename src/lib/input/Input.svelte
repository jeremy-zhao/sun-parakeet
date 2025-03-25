<script lang="ts" module>
  import './Input.css'

  import CloseIcon from '../icons/close-circle-fill.svg?raw'
  import EyeIcon from '../icons/eye-line.svg?raw'
  import EyeCloseIcon from '../icons/eye-close-line.svg?raw'

  import Button from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'

  /** 输入框类型 */
  export type InputTypeAttribute = 'number' | 'password' | 'text'

  /** 输入框属性 */
  export interface InputAttributes extends HTMLInputAttributes {
    /** 是否启用清除图标？点击清除图标后会清空输入框 */
    clearable?: boolean
    /** 输入框类型。HTML input 标签 type 属性的子集 */
    type?: InputTypeAttribute
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    clearable = false,
    type = 'text',
    placeholder = '请输入内容',
    ...props
  }: InputAttributes = $props()

  let pwdVisible = $state(false)
  let typed = $derived(type === 'password' ? (pwdVisible ? 'text' : type) : type)
</script>

<div class="sun-parakeet-input">
  <input bind:value class="sun-parakeet-input-element" type={typed} {placeholder} {...props} />
  {#if type === 'password'}
    <Button class="sun-parakeet-input__button" color="text" onclick={() => (pwdVisible = !pwdVisible)}>
      {#if pwdVisible}
        <Icon size={22} svg={EyeIcon} />
      {:else}
        <Icon size={22} svg={EyeCloseIcon} />
      {/if}
    </Button>
  {/if}
  {#if clearable && value?.length}
    <Button class="sun-parakeet-input__button" color="text" onclick={() => (value = '')}>
      <Icon size={22} svg={CloseIcon} />
    </Button>
  {/if}
</div>
