<script lang="ts" module>
  import './CheckList.css'

  import List, { type ListAttributes } from '../display/List.svelte'

  /** 可勾选列表属性 */
  export interface CheckListAttributes extends ListAttributes {
    /** 选中项 */
    value?: PropertyKey[]
  }

  /** 可勾选列表上下文信息 */
  export interface CheckListContext {
    /** 注册 */
    register: (value: PropertyKey, input: HTMLInputElement, check: (chedked: boolean) => void) => void
    /** 注销 */
    unregister: (value: PropertyKey) => void
    /** 数据变更事件 */
    onChange: () => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }
</script>

<script lang="ts">
</script>
