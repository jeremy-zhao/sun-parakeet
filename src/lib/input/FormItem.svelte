<script lang="ts" module>
  import './FormItem.css'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 表单属性 */
  export interface FormItemAttributes extends HTMLAttributes<EventTarget> {}
</script>

<script lang="ts">
  let { children, ...props }: FormItemAttributes = $props()
</script>

<div class="sun-parakeet-form-item" {...props}>
  {@render children?.()}
</div>
