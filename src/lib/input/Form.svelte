<script lang="ts" module>
  import './Form.css'
  import type { HTMLFormAttributes } from 'svelte/elements'

  /** 表单属性 */
  export interface FormAttributes extends HTMLFormAttributes {}
</script>

<script lang="ts">
  let { children, ...props }: FormAttributes = $props()
</script>

<form class="sun-parakeet-form" {...props}>
  {@render children?.()}
</form>
