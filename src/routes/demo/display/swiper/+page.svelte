<script lang="ts">
  import { Page, List, Swiper, SwiperItem, showToast } from '$lib'

  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']

  let value = $state(0)
</script>

{#snippet items()}
  {#each colors as color, index}
    <SwiperItem
      class="flex items-center justify-center text-white"
      style="background-color: {color}; font-size: 48px;"
    >
      <span>{index + 1}</span>
    </SwiperItem>
  {/each}
{/snippet}

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Swiper style="height: 120px" onClick={val => showToast({ text: (val + 1).toString() })}>
        {@render items()}
      </Swiper>
    </div>
  </List>
  <List header="基础用法">
    <div class="bg-white p-4">
      <Swiper style="height: 120px" autoplay>
        {@render items()}
      </Swiper>
    </div>
  </List>
</Page>
