<script lang="ts" module>
  import './Stepper.css'
  import MinusIcon from '../icons/subtract-line.svg?raw'
  import PlusIcon from '../icons/add-line.svg?raw'

  import type { Snippet } from 'svelte'
  import type { HTMLInputAttributes } from 'svelte/elements'
  import Icon from '../common/Icon.svelte'

  export interface StepperAttributes extends HTMLInputAttributes {
    /** 值 */
    value?: number
    /** 样式风格 */
    theme?: 'round'
    /** 最大值 */
    max?: number
    /** 最小值 */
    min?: number
    /** 步长。默认值 1 */
    step?: number
    /** 允许的小数位数。默认值 0 */
    digits?: number
    /** 自定义内容显示 */
    display?: Snippet<[value: number]>
    /** 隐藏输入框 */
    hideInput?: boolean
    /** 隐藏减少按钮 */
    hideMinus?: boolean
    /** 隐藏增加按钮 */
    hidePlus?: boolean
    /** 锁定输入框。只能通过按钮操作 */
    lockInput?: boolean
    /** 变更事件 */
    onChange?: (newValue: number, oldValue: number) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(0),
    theme,
    max,
    min,
    step = 1,
    digits = 0,
    display,
    lockInput = false,
    hideInput = false,
    hideMinus = false,
    hidePlus = false,
    readonly = false,
    disabled = false,
    onChange,
    class: clazz,
    ...props
  }: StepperAttributes = $props()

  let _input = $state<HTMLInputElement>()

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
  class="sunp-stepper {clazz}"
  class:sunp-stepper-round={theme === 'round'}
  class:sunp-stepper-disabled={disabled}
  role="group"
>
  <button
    class="sunp-stepper__button sunp-stepper__button-minus"
    style:visibility={hideMinus ? 'hidden' : 'visible'}
    disabled={disabled || readonly || (typeof min === 'number' && value <= min)}
    onclick={handleMinus}
  >
    <Icon class="sunp-stepper__icon" svg={MinusIcon} size={24} />
  </button>
  <div class="sunp-steper__content" style:visibility={hideInput ? 'hidden' : 'visible'}>
    <div class="sunp-steper__display">
      {#if typeof display === 'function'}
        {@render display(value)}
      {:else}
        {value.toFixed(digits)}
      {/if}
    </div>
    {#if !readonly && !disabled && !lockInput}
      <input
        bind:this={_input}
        class="sunp-steper__input"
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
    class="sunp-stepper__button sunp-stepper__button-plus"
    style:visibility={hidePlus ? 'hidden' : 'visible'}
    disabled={disabled || readonly || (typeof max === 'number' && value >= max)}
    onclick={handlePlus}
  >
    <Icon class="sunp-stepper__icon" svg={PlusIcon} size={24} />
  </button>
</div>
