<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  /** 按钮形状 */
  export type ButtonShape = 'normal' | 'rounded' | 'rectangular'

  /** 按钮属性 */
  export interface ButtonAttributes extends HTMLButtonAttributes {
    /** 按钮颜色。默认值: 'normal' */
    color?: string
    /** 按钮形状。默认值 'normal'，可被 ButtonTheme.shape 覆盖。 */
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

<button class="sun-parakeet-button {colored} {shaped} {clazz}" class:disabled {disabled} {...props}
  >{@render children?.()}</button
>

<style lang="postcss">
  .sun-parakeet-button {
    @apply box-border flex select-none items-center justify-center rounded-md px-4 py-2;
    width: var(--sp-button-width, 100);
    height: var(--sp-button-height, 40px);

    &.disabled {
      @apply border-dashed border-gray-400 bg-gray-100 text-gray-400;
    }

    &.sun-parakeet-button__border {
      @apply border;
    }

    &.sun-parakeet-button__block {
      @apply block w-full;
    }

    &.sun-parakeet-button__rounded {
      @apply rounded-full;
    }

    &.sun-parakeet-button__rectangular {
      @apply rounded-none;
    }

    &.sun-parakeet-button__normal {
      @apply border-gray-400 bg-white text-gray-600 active:border-blue-600 active:bg-blue-100 active:text-blue-600;
    }

    &.sun-parakeet-button__primary {
      @apply border-transparent bg-blue-500 text-white active:bg-blue-600;
    }

    &.sun-parakeet-button__primary-plain {
      @apply border-blue-400 bg-blue-100 text-blue-600 active:border-blue-600 active:bg-blue-200;
    }

    &.sun-parakeet-button__success {
      @apply border-transparent bg-green-500 text-white active:bg-green-600;
    }

    &.sun-parakeet-button__success-plain {
      @apply border-green-400 bg-green-100 text-green-600 active:border-green-600 active:bg-green-200;
    }

    &.sun-parakeet-button__warning {
      @apply border-transparent bg-yellow-500 text-white active:bg-yellow-600;
    }

    &.sun-parakeet-button__warning-plain {
      @apply border-yellow-400 bg-yellow-100 text-yellow-600 active:border-yellow-600 active:bg-yellow-200;
    }

    &.sun-parakeet-button__danger {
      @apply border-transparent bg-red-500 text-white active:bg-red-600;
    }

    &.sun-parakeet-button__danger-plain {
      @apply border-red-400 bg-red-100 text-red-600 active:border-red-600 active:bg-red-200;
    }

    &.sun-parakeet-button__text {
      @apply border-gray-400 bg-white text-black active:bg-gray-100;
    }
  }
</style>
