<script lang="ts" module>
  import './Swiper.css'

  import type { HTMLAttributes } from 'svelte/elements'

  export interface SwiperItemAttributes extends HTMLAttributes<EventTarget> {}
</script>

<script lang="ts">
  let { class: clazz, children, ...props }: SwiperItemAttributes = $props()
</script>

<div class="sun-parakeet-swiper-item {clazz}" {...props}>
  {@render children?.()}
</div>
