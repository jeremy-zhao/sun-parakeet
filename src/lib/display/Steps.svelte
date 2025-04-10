<script lang="ts" module>
  import './Steps.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 步骤条属性 */
  export interface StepsAttributes extends HTMLAttributes<EventTarget> {
    /** 步骤条的方向。默认值 'horizontal' */
    direction: 'horizontal' | 'vertical'
    /** 当前步骤的索引值 */
    value?: number
  }
</script>

<script lang="ts">
</script>
