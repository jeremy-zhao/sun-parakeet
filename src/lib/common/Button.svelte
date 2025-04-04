<script lang="ts" module>
  import './Button.css'

  import type { HTMLButtonAttributes } from 'svelte/elements'

  /** 按钮属性 */
  export interface ButtonAttributes extends HTMLButtonAttributes {
    /** 按钮颜色。默认值：'normal' */
    color?: string
    /** 按钮形状。默认值：'normal'，可被 ButtonTheme.shape 覆盖。 */
    shape?: 'normal' | 'rounded' | 'rectangular' | number
  }

  export interface ButtonTheme {
    /** 按钮颜色定义 */
    shape?: 'normal' | 'rounded' | 'rectangular' | number
    /** 按钮颜色定义 */
    colors?: {
      /** 自定义颜色 */
      [color: string]: string | undefined
      /** 普通 */
      normal?: string
      /** 主要 */
      primary?: string
      /** 主要(扁平) */
      'primary-plain'?: string
      /** 成功 */
      success?: string
      /** 成功(扁平) */
      'success-plain'?: string
      /** 警告 */
      warning?: string
      /** 警告(扁平) */
      'warning-plain'?: string
      /** 危险 */
      danger?: string
      /** 危险(扁平) */
      'danger-plain'?: string
      /** 取消 */
      cancel?: string
      /** 取消(扁平) */
      'cancel-plain'?: string
      /** 文本 */
      text?: string
    }
  }

  const defaultButtonTheme: ButtonTheme = {
    shape: 'normal',
    colors: {
      normal: 'sun-parakeet-button__normal',
      primary: 'sun-parakeet-button__primary',
      'primary-plain': 'sun-parakeet-button__primary-plain',
      success: 'sun-parakeet-button__success',
      'success-plain': 'sun-parakeet-button__success-plain',
      warning: 'sun-parakeet-button__warning',
      'warning-plain': 'sun-parakeet-button__warning-plain',
      danger: 'sun-parakeet-button__danger',
      'danger-plain': 'sun-parakeet-button__danger-plain',
      cancel: 'sun-parakeet-button__cancel',
      'cancel-plain': 'sun-parakeet-button__cancel-plain',
      text: 'sun-parakeet-button__text',
      // TODO：Picker 按钮样式，默认 css 在 Picker.css 文件中。可以被覆盖，这里在做主题的时候可能要改
      'picker-ok': 'sun-parakeet-picker__ok',
      'picker-cancel': 'sun-parakeet-picker__cancel',
      'picker-clear': 'sun-parakeet-picker__clear',
    },
  }
</script>

<script lang="ts">
  let { color = 'normal', shape, children, class: clazz, disabled = false, ...props }: ButtonAttributes = $props()

  let _color = $derived(disabled ? 'sun-parakeet-button__disabled' : defaultButtonTheme.colors?.[color])

  let _radius = $derived.by(() => {
    if (shape === 'normal') return '6px'
    else if (shape === 'rounded') return '9999px'
    else if (shape === 'rectangular') return '0'
    else if (typeof shape === 'number' && shape >= 0) return `${shape}px`
    else return '6px'
  })
</script>

<button class="sun-parakeet-button {_color} {clazz}" style:border-radius={_radius} {disabled} {...props}>
  {@render children?.()}
</button>
