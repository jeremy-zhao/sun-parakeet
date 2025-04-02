<script lang="ts" module>
  import { Page, List, ListItem, SwipeAction, Button, Space, type SwipeActionState } from '$lib'
</script>

<script lang="ts">
  let swipeActionState = $state<SwipeActionState>('close')
</script>

<Page class="bg-gray-100">
  <List header="搭配列表使用">
    {#each ['A', 'B', 'C'] as txt}
      <SwipeAction>
        <ListItem>{txt}</ListItem>
        {#snippet leftActions()}
          <Button class="border-0" shape="rectangular" color="primary-plain">置顶</Button>
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
  <List header="搭配图片使用">
    <SwipeAction>
      <img src="/images/sun-parakeet.jpg" alt="小太阳鹦鹉" />
      {#snippet rightActions()}
        <Button class="border-0" shape="rectangular" color="danger">删除</Button>
      {/snippet}
    </SwipeAction>
  </List>
  <List header="手动控制归位逻辑">
    <SwipeAction bind:state={swipeActionState} keepOnAction keepOnTouchOutside>
      <ListItem>ABC</ListItem>
      {#snippet leftActions()}
        <Button class="border-0" shape="rectangular" color="primary-plain">置顶</Button>
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
          swipeActionState = 'close'
        }}>归位</Button
      >
      <Button
        onclick={() => {
          swipeActionState = 'left'
        }}>左侧打开</Button
      >
      <Button
        onclick={() => {
          swipeActionState = 'right'
        }}>右侧打开</Button
      >
    </Space>
  </List>
</Page>
