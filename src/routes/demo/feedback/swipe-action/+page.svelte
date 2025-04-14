<script lang="ts" module>
  import { Page, List, ListItem, SwipeAction, Button, Space, type SwipeActionStatus } from '$lib'
</script>

<script lang="ts">
  let swipeActionStatus = $state<SwipeActionStatus>('close')
</script>

<Page class="bg-gray-100">
  <List header="搭配列表使用">
    {#each ['A', 'B', 'C'] as txt}
      <SwipeAction>
        <ListItem>{txt}</ListItem>
        {#snippet leftActions()}
          <Button class="border-0" shape="rectangular" color="primary">置顶</Button>
        {/snippet}
        {#snippet rightActions()}
          <Space --sp-gap="0px">
            <Button class="border-0" shape="rectangular" color="cancel">取消关注</Button>
            <Button class="border-0" shape="rectangular" color="warning">免打扰</Button>
            <Button class="border-0" shape="rectangular" color="danger">删除</Button>
          </Space>
        {/snippet}
      </SwipeAction>
    {/each}
  </List>
  <List header="图片预览">
    <Space class="bg-white p-4" block --sp-gap="16px">
      <SwipeAction>
        <img src="/images/sun-parakeet.jpg" alt="小太阳鹦鹉" />
        {#snippet rightActions()}
          <Button class="border-0" shape="rectangular" color="danger">删除</Button>
        {/snippet}
      </SwipeAction>
      <SwipeAction>
        <img src="/images/sun-parakeet.jpg" alt="小太阳鹦鹉" />
        {#snippet rightActions()}
          <Button class="border-0" shape="rectangular" color="danger">删除</Button>
        {/snippet}
      </SwipeAction>
    </Space>
  </List>
  <List header="手动控制归位逻辑">
    <SwipeAction bind:status={swipeActionStatus} keepOnAction keepOnTouchOutside>
      <ListItem>ABC</ListItem>
      {#snippet leftActions()}
        <Button class="border-0" shape="rectangular" color="primary">置顶</Button>
      {/snippet}
      {#snippet rightActions()}
        <Space --sp-gap="0px">
          <Button class="border-0" shape="rectangular" color="cancel">取消关注</Button>
          <Button class="border-0" shape="rectangular" color="warning">免打扰</Button>
          <Button class="border-0" shape="rectangular" color="danger">删除</Button>
        </Space>
      {/snippet}
    </SwipeAction>
    <Space class="bg-white px-4 py-2" block>
      <Button
        onclick={() => {
          swipeActionStatus = 'close'
        }}>归位</Button
      >
      <Button
        onclick={() => {
          swipeActionStatus = 'left'
        }}>左侧打开</Button
      >
      <Button
        onclick={() => {
          swipeActionStatus = 'right'
        }}>右侧打开</Button
      >
    </Space>
  </List>
</Page>
