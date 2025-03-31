<script lang="ts" module>
  import './CheckboxGroup.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface CheckboxGroupAttributes extends HTMLAttributes<EventTarget> {
    /** 整组失效 */
    disabled?: boolean
    /** 选中的选项 */
    value?: unknown[]
    /** 变化时回调函数 */
    onChange?: (value: any[]) => void
  }

  /** 复选框组上下文信息 */
  export interface CheckboxGroupContext {
    /** 注册 */
    register: (input: HTMLInputElement) => void
    /** 注销 */
    unregister: (input: HTMLInputElement) => void
    /** 数据变更事件 */
    onChange: (value: unknown, checked: boolean) => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let { value = $bindable([]), children, onChange, ...props }: CheckboxGroupAttributes = $props()
</script>

<div class="sun-parakeet-checkbox-group">
  {@render children?.()}
</div>
