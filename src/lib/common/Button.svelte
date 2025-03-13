<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface ButtonAttributes extends HTMLButtonAttributes {
    /** 按钮类型。默认为 `normal` */
    color?: string
    /** 是否朴素按钮 */
    plain?: boolean
  }
</script>

<script lang="ts">
  let {
    color = 'primary',
    plain = false,
    children,
    class: clazz,
    disabled = false,
    ...props
  }: ButtonAttributes = $props()
</script>

<button class="sun-parakeet-button {clazz}" class:disabled class:plain {disabled} {...props}
  >{@render children?.()}</button
>

<style lang="postcss">
  .sun-parakeet-button {
    @apply flex select-none items-center justify-center rounded-full px-4 py-2;

    &.disabled {
      @apply border-dashed border-gray-400 bg-gray-100 text-gray-400;
    }

    &.plain {
    }
  }
</style>
