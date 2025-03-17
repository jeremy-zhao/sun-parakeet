<script lang="ts" module>
  import Button, { type ButtonAttributes } from '../common/Button.svelte'

  export interface ActionSheetItemAttributes extends ButtonAttributes {}
</script>

<script lang="ts">
  const { class: clazz, ...props }: ActionSheetItemAttributes = $props()
</script>

<Button class="sp-action-sheet-item {clazz}" {...props} />

<style lang="postcss">
  :global(.sp-action-sheet-item) {
    @apply rounded-none border-0;
  }
</style>
