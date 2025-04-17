<script lang="ts">
  import { Page, List, Swiper, Space, Button, Tabs, TabPanel, Popup } from '$lib'

  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac', 'pink']

  let value = $state(0)
  let selectedTab = $state('横向')
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

<Page class="flex flex-col items-stretch justify-stretch bg-gray-100">
  <Tabs
    bind:value={selectedTab}
    class="flex-none border-b bg-gray-50"
    tabs={['横向', '纵向', '指示器', '特殊用法']}
  />

  <!-- 横向 -->
  <TabPanel class="flex-auto" visible={selectedTab === '横向'}>
    <List class="-mt-1" header="基础用法">
      <div class="bg-white p-4">
        <Swiper style="height: 120px">
          {@render items(colors.slice(0, 2))}
        </Swiper>
      </div>
    </List>
    <List header="圆角-回弹">
      <div class="bg-white p-4">
        <Swiper style="height: 120px; border-radius: 8px" bounce>
          {@render items(colors.slice(0, 3))}
        </Swiper>
      </div>
    </List>
    <List header="自动播放">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" autoplay>
          {@render items(colors.slice(0, 4))}
        </Swiper>
      </div>
    </List>
    <List header="自动播放-循环">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" autoplay loop>
          {@render items(colors)}
        </Swiper>
      </div>
    </List>
    <List header="手动控制-循环">
      <div class="bg-white p-4">
        <Swiper bind:value style="height: 120px" loop>
          {@render items(colors)}
        </Swiper>
      </div>
      <Space block class="bg-white p-4">
        {#each colors, index}
          <Button onclick={() => (value = index)}>{index + 1}</Button>
        {/each}
      </Space>
    </List>
  </TabPanel>

  <!-- 纵向 -->
  <TabPanel class="flex-auto" visible={selectedTab === '纵向'}>
    <List class="-mt-1" header="基础用法">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" direction="vertical">
          {@render items(colors.slice(0, 2))}
        </Swiper>
      </div>
    </List>
    <List header="圆角-回弹">
      <div class="bg-white p-4">
        <Swiper style="height: 120px; border-radius: 8px" direction="vertical" bounce>
          {@render items(colors.slice(0, 3))}
        </Swiper>
      </div>
    </List>
    <List header="自动播放">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" direction="vertical" autoplay>
          {@render items(colors.slice(0, 4))}
        </Swiper>
      </div>
    </List>
    <List header="自动播放-循环">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" direction="vertical" autoplay loop>
          {@render items(colors)}
        </Swiper>
      </div>
    </List>
    <List header="手动控制-循环">
      <div class="bg-white p-4">
        <Swiper bind:value style="height: 120px" direction="vertical" loop>
          {@render items(colors)}
        </Swiper>
      </div>
      <Space block class="bg-white p-4">
        {#each colors, index}
          <Button onclick={() => (value = index)}>{index + 1}</Button>
        {/each}
      </Space>
    </List>
  </TabPanel>

  <!-- 指示器 -->
  <TabPanel class="flex-auto" visible={selectedTab === '指示器'}>
    <List class="-mt-1" header="指示器颜色">
      <Space class="bg-white p-4" direction="vertical" block>
        <Swiper
          style="height: 120px"
          --sunp-color="rgba(0, 0, 0, 0.4)"
          --sunp-active-color="#ffc0cb"
          --sunp-size="10px"
          --sunp-active-size="30px"
          --sunp-radius="15px"
          --sunp-gap="8px"
        >
          {@render items(colors)}
        </Swiper>
        <p class="text-sm text-gray-600">通过 CSS 变量控制指示器的外观</p>
      </Space>
    </List>
    <List header="指示器在滑块外面">
      <Space class="bg-white p-4" direction="vertical" block>
        <Swiper
          class="bg-gray-100"
          style="height: 120px; border-radius: 6px"
          bounce
          --sunp-radius="8px"
          --sunp-padding="0 0 16px"
        >
          {@render items(colors)}
        </Swiper>
        <p class="text-sm text-gray-600">
          通过 --sunp-padding 可以控制滑动轨道区域的 padding，从而实现指示器和滑块“分离”的效果
        </p>
      </Space>
    </List>
    <List header="自定义指示器">
      <Space class="bg-white p-4" direction="vertical" block>
        <Swiper style="height: 120px">
          {@render items(colors)}
          {#snippet indicator(total: number, value: number)}
            <div
              style="position: absolute; top: 8px; right: 8px; padding: 0.25rem 0.5rem; border-radius: 5px; background-color: rgb(75 85 99 / 0.5); font-size: 14px; color: white"
            >
              {value + 1} / {total}
            </div>
          {/snippet}
        </Swiper>
        <p class="text-sm text-gray-600">你可以完全自定义指示器的渲染，甚至改变指示器的位置</p>
      </Space>
    </List>
    <List header="无指示器">
      <div class="bg-white p-4">
        <Swiper style="height: 120px" autoplay loop>
          {@render items(colors)}
          {#snippet indicator()}{/snippet}
        </Swiper>
      </div>
    </List>
  </TabPanel>

  <!-- 特殊用法 -->
  <TabPanel class="flex-auto" visible={selectedTab === '特殊用法'}>
    <List class="-mt-1" header="全屏引导">
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
        <Swiper style="height: 120px" --sunp-width="75%">
          {@render items(colors)}
        </Swiper>
        <p class="text-sm text-gray-600">通过 --sunp-width --sunp-height 控制内部元素的宽高</p>
      </Space>
    </List> -->
  </TabPanel>
</Page>
