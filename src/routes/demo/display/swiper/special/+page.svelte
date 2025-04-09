<script lang="ts">
  import { Page, List, Swiper, Button, Popup, Space } from '$lib'

  // const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac', 'pink']
  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']
  // const colors = ['#ace0ff', '#bcffbd', '#e4fabd']
  // const colors = ['#ace0ff', '#bcffbd']
  // const colors = ['#ace0ff']

  let visible = $state(false)
</script>

{#snippet items(colors: string[])}
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
  <List header="全屏引导">
    <div class="bg-white p-4">
      <Button onclick={() => (visible = true)}>显示弹出层</Button>
    </div>
  </List>
  <Popup bind:visible class="h-full" destroyOnClose>
    <Swiper class="h-full">
      {@render items(colors.slice(0, 2))}
      <div class="flex items-center justify-center bg-white text-white">
        <Button onclick={() => (visible = false)}>开始使用</Button>
      </div>
    </Swiper>
  </Popup>
  <!-- <List header="宽度控制">
    <Space class="bg-white p-4" direction="vertical" block>
      <Swiper style="height: 120px" --sp-width="75%">
        {@render items(colors)}
      </Swiper>
      <p class="text-sm text-gray-600">通过 --sp-width --sp-height 控制内部元素的宽高</p>
    </Space>
  </List> -->
  <p></p>
</Page>
