<script lang="ts" module>
  import './Avatar.css'

  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /** 头像 */
  export interface AvatarAttributes extends HTMLAttributes<EventTarget> {
    /** 占位图 */
    fallback?: string | Snippet
  }
</script>

<script lang="ts">
</script>

<div class="sp-avatar"></div>

<style type="postcss">
  .sp-avatar {
  }
</style>
