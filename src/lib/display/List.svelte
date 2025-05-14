<script lang="ts" module>
  import './List.css'

  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 列表 */
  export interface ListAttributes extends HTMLAttributes<EventTarget> {
    /** 标题 */
    header?: string | Snippet
  }
</script>

<script lang="ts">
  let { header, children, class: clazz, ...props }: ListAttributes = $props()
</script>

<ul class="sunp-list {clazz}" {...props}>
  {#if typeof header === 'string'}
    <header class="sunp-list__header">
      {header}
    </header>
  {:else if typeof header === 'function'}
    <header class="sunp-list__header">
      {@render header()}
    </header>
  {/if}

  {@render children?.()}
</ul>
