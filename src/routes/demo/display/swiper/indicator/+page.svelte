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
  <List header="指示器颜色">
    <Space class="bg-white p-4" direction="vertical" block>
      <Swiper
        style="height: 120px"
        --sp-color="rgba(0, 0, 0, 0.4)"
        --sp-active-color="#ffc0cb"
        --sp-size="10px"
        --sp-active-size="30px"
        --sp-radius="15px"
        --sp-gap="8px"
      >
        {@render items()}
      </Swiper>
      <p class="text-sm text-gray-600">通过 CSS 变量控制指示器的外观</p>
    </Space>
  </List>
  <List header="指示器在滑块外面">
    <Space class="bg-white p-4" direction="vertical" block>
      <Swiper
        class="bg-gray-100"
        style="height: 120px"
        bounce
        --sp-radius="8px"
        --sp-padding="0 0 16px"
      >
        {@render items()}
      </Swiper>
      <p class="text-sm text-gray-600">
        通过 --sp-padding 可以控制滑动轨道区域的 padding，从而实现指示器和滑块“分离”的效果
      </p>
    </Space>
  </List>
  <List header="自定义指示器">
    <Space class="bg-white p-4" direction="vertical" block>
      <Swiper style="height: 120px">
        {@render items()}
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
        {@render items()}
        {#snippet indicator()}{/snippet}
      </Swiper>
    </div>
  </List>
</Page>
