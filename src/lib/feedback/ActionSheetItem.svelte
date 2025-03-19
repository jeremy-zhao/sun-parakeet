<script lang="ts" module>
  import './ActionSheetItem.css'

  import Button, { type ButtonAttributes } from '../common/Button.svelte'

  export interface ActionSheetItemAttributes extends ButtonAttributes {}
</script>

<script lang="ts">
  const { class: clazz, ...props }: ActionSheetItemAttributes = $props()
</script>

<Button class="sun-parakeet-action-sheet-item {clazz}" color="text" shape="rectangular" {...props} />
