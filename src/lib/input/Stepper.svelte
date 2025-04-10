<script lang="ts" module>
  import './Stepper.css'
  import MinusIcon from '../icons/subtract-line.svg?raw'
  import PlusIcon from '../icons/add-line.svg?raw'

  import { getContext, type Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'
  import type { FormItemContext } from './FormItem.svelte'

  export interface StepperAttributes extends HTMLInputAttributes {
    /** 允许的小数位数。默认值 0 */
    digits?: number
    /** 自定义格式化 */
    display?: Snippet<[value: number]>
    /** 隐藏输入框 */
    hideInput?: boolean
    /** 隐藏减少按钮 */
    hideMinus?: boolean
    /** 隐藏增加按钮 */
    hidePlus?: boolean
    /** 锁定输入框。只能通过按钮操作 */
    lockInput?: boolean
    /** 最大值 */
    max?: number
    /** 最小值 */
    min?: number
    /** 值 */
    value?: number
    /** 步长。默认值 1 */
    step?: number
    /** 样式风格 */
    theme?: 'round'
    /** 变更事件 */
    onChange?: (newValue: number, oldValue: number) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    digits = 0,
    display,
    lockInput = false,
    hideInput = false,
    hideMinus = false,
    hidePlus = false,
    max,
    min,
    step = 1,
    theme,
    onChange,
    class: clazz,
    disabled = false,
    readonly = false,
    ...props
  }: StepperAttributes = $props()

  let _input = $state<HTMLInputElement>()

  let formItem = getContext<FormItemContext | undefined>('sun_parakeet_form_item')

  // 焦点控制 =================================

  let _focus = $state(false)
  let opacity = $derived(_focus && !disabled ? 1 : 0)

  function handleFocus() {
    _focus = true
    _input?.select()
  }

  function handleBlur() {
    _focus = false
    _input && set(_input.value)
  }

  // 输入控制 =================================

  function set(val: number | string) {
    let num = Number(val)
    if (isNaN(num)) num = 0

    if (typeof min === 'number' && num < min) num = min
    else if (typeof max === 'number' && num > max) num = max

    num = Number(num.toFixed(digits))
    _input && (_input.value = num.toFixed(digits))

    if (value !== num) {
      const oldValue = value
      value = num
      onChange?.(num, oldValue)
      formItem?.onChange(num)
    }
  }

  function handleInput(e: InputEvent) {
    const { data } = e
    if (!data) return

    if (!/\d|\./.test(data)) {
      e.preventDefault()
    }
  }

  function handleMinus() {
    if (typeof value !== 'number') return set(value)
    if (typeof min === 'number' && value <= min) return
    set(value - step)
  }

  function handlePlus() {
    if (typeof value !== 'number') return set(value)
    if (typeof max === 'number' && value >= max) return
    set(value + step)
  }

  $effect(() => {
    set(value)
  })
</script>

<div
  class="sun-parakeet-stepper {clazz}"
  class:sun-parakeet-stepper-round={theme === 'round'}
  class:sun-parakeet-stepper-disabled={disabled}
  role="group"
>
  <button
    class="sun-parakeet-stepper__button sun-parakeet-stepper__button-minus"
    style:visibility={hideMinus ? 'hidden' : 'visible'}
    disabled={disabled || readonly || (typeof min === 'number' && value <= min)}
    onclick={handleMinus}
  >
    <Icon class="sun-parakeet-stepper__icon" svg={MinusIcon} size={24} />
  </button>
  <div class="sun-parakeet-steper__content" style:visibility={hideInput ? 'hidden' : 'visible'}>
    <div class="sun-parakeet-steper__display">
      {#if typeof display === 'function'}
        {@render display(value)}
      {:else}
        {value.toFixed(digits)}
      {/if}
    </div>
    {#if !readonly && !disabled && !lockInput}
      <input
        bind:this={_input}
        class="sun-parakeet-steper__input"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        style:opacity
        {...props}
        onbeforeinput={handleInput}
        onfocus={handleFocus}
        onblur={handleBlur}
      />
    {/if}
  </div>
  <button
    class="sun-parakeet-stepper__button sun-parakeet-stepper__button-plus"
    style:visibility={hidePlus ? 'hidden' : 'visible'}
    disabled={disabled || readonly || (typeof max === 'number' && value >= max)}
    onclick={handlePlus}
  >
    <Icon class="sun-parakeet-stepper__icon" svg={PlusIcon} size={24} />
  </button>
</div>
