<script lang="ts" module>
  import './FormItemButton.css'
  import ArrowIcon from '../icons/arrow-right-s-line.svg?raw'

  import Button, { type ButtonAttributes } from '../common/Button.svelte'
  import Icon from '../common/Icon.svelte'
</script>

<script lang="ts">
  let { class: clazz, color, children, ...props }: ButtonAttributes = $props()
</script>

<Button color="form-item" shape="rectangular" {...props}>
  {@render children?.()}
  <Icon class="sun-parakeet-form-item-button__arrow" svg={ArrowIcon} />
</Button>
