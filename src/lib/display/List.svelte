<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 列表 */
  export interface ListAttributes extends HTMLAttributes<HTMLDivElement> {
    /** 标题 */
    header: string | Snippet
  }
</script>
