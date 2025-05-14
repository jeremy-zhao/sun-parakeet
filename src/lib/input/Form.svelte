<script lang="ts" module>
  import './Form.css'

  import FormHeader from './FormHeader.svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLFormAttributes } from 'svelte/elements'

  /** 表单属性 */
  export interface FormAttributes extends HTMLFormAttributes {
    /** 标题 */
    header?: string | Snippet
    /** 表单布局 */
    layout?: 'horizontal' | 'vertical'
  }
</script>

<script lang="ts">
  let { header, layout = 'vertical', name, children, ...props }: FormAttributes = $props()
</script>

<form class="sunp-form sunp-form-{layout}" {...props} onsubmit={e => e.preventDefault()}>
  {#if typeof header === 'string'}
    <FormHeader>{header}</FormHeader>
  {:else if typeof header === 'function'}
    <FormHeader>{@render header()}</FormHeader>
  {/if}

  {@render children?.()}
</form>
