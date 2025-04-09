<script lang="ts">
  import { Page, List, Swiper, Space, Button, showToast } from '$lib'

  // const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac', 'pink']
  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']
  // const colors = ['#ace0ff', '#bcffbd', '#e4fabd']
  // const colors = ['#ace0ff', '#bcffbd']
  // const colors = ['#ace0ff']

  let value = $state(0)
</script>

{#snippet items()}
  {#each colors as color, index}
    <div
      class="flex items-center justify-center text-white"
      style="background-color: {color}; font-size: 48px;"
    >
      <span>{index + 1}</span>
    </div>
  {/each}
{/snippet}

<Page class="bg-gray-100">
  <List header="纵向">
    <div class="bg-white p-4">
      <Swiper style="height: 120px" direction="vertical">
        {@render items()}
      </Swiper>
    </div>
  </List>
  <List header="圆角-回弹">
    <div class="bg-white p-4">
      <Swiper style="height: 120px; border-radius: 8px" direction="vertical" bounce>
        {@render items()}
      </Swiper>
    </div>
  </List>
  <List header="自动播放">
    <div class="bg-white p-4">
      <Swiper style="height: 120px" direction="vertical" autoplay>
        {@render items()}
      </Swiper>
    </div>
  </List>
  <List header="自动播放-循环">
    <div class="bg-white p-4">
      <Swiper style="height: 120px" direction="vertical" autoplay loop>
        {@render items()}
      </Swiper>
    </div>
  </List>
  <List header="手动控制-循环">
    <div class="bg-white p-4">
      <Swiper bind:value style="height: 120px" direction="vertical" loop>
        {@render items()}
      </Swiper>
    </div>
    <Space block class="bg-white p-4">
      {#each colors, index}
        <Button onclick={() => (value = index)}>{index + 1}</Button>
      {/each}
    </Space>
  </List>
</Page>
