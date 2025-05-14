<script lang="ts" module>
  import './TabPanel.css'

  import type { HTMLAttributes } from 'svelte/elements'

  /** 选项卡页 */
  export interface TabPanelAttributes extends HTMLAttributes<EventTarget> {
    visible: boolean
  }
</script>

<script lang="ts">
  let _self: HTMLElement
  let _scrollTop = 0

  let { visible, class: clazz, children, ...props }: TabPanelAttributes = $props()

  $effect(() => {
    if (visible) {
      _self.scrollTop = _scrollTop
    }
  })

  function handleScroll() {
    _scrollTop = _self.scrollTop
  }
</script>

<section
  bind:this={_self}
  class="sunp-tab-panel {clazz}"
  class:sunp-tab-panel-hidden={!visible}
  onscroll={handleScroll}
  {...props}
>
  {@render children?.()}
</section>
