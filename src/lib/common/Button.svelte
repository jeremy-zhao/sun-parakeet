<script lang="ts" module>
  import './Button.css'

  import type { HTMLButtonAttributes } from 'svelte/elements'

  /** 按钮形状 */
  export type ButtonShape = 'normal' | 'rounded' | 'rectangular'

  /** 按钮属性 */
  export interface ButtonAttributes extends HTMLButtonAttributes {
    /** 按钮颜色。默认值：'normal' */
    color?: string
    /** 按钮形状。默认值：'normal'，可被 ButtonTheme.shape 覆盖。 */
    shape?: ButtonShape
    /** 是否禁用 */
    disabled?: boolean
  }

  export interface ButtonTheme {
    /** 按钮颜色定义 */
    shape?: 'normal' | 'rounded' | 'rectangular'
    /** 按钮颜色定义 */
    colors?: {
      /** 自定义颜色 */
      [color: string]: string | undefined
      /** 普通 */
      normal?: string
      /** 主要 */
      primary?: string
      /** 主要(扁平) */
      primary_plain?: string
      /** 成功 */
      success?: string
      /** 成功(扁平) */
      success_plain?: string
      /** 警告 */
      warning?: string
      /** 警告(扁平) */
      warning_plain?: string
      /** 危险 */
      danger?: string
      /** 危险(扁平) */
      danger_plain?: string
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
      text: 'sun-parakeet-button__text',
    },
  }
</script>

<script lang="ts">
  let { color = 'normal', shape, children, class: clazz, disabled = false, ...props }: ButtonAttributes = $props()

  let colored = $derived(disabled ? '' : defaultButtonTheme.colors?.[color])

  let shaped = $derived.by(() => {
    switch (shape ?? defaultButtonTheme.shape ?? 'normal') {
      case 'rounded':
        return `sun-parakeet-button__rounded`
      case 'rectangular':
        return `sun-parakeet-button__rectangular`
      default:
        return ''
    }
  })
</script>

<button class="sun-parakeet-button {colored} {shaped} {clazz}" class:disabled {disabled} {...props}>
  {@render children?.()}
</button>
