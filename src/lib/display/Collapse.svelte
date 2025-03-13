<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 折叠面板 */
  export interface CollapseAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 展开状态 */
    expanded?: boolean
    /** 标题 */
    header: string | Snippet
  }
</script>

<script lang="ts">
  let { expanded = $bindable(false), class: clazz, ...props } = $props()
</script>

<div class="sun-parakeet-collapse {clazz}" {...props}>
  <div class="sun-parakeet-collapse-"></div>
</div>
