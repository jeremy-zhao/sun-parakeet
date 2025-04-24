<script lang="ts" module>
  import { Page, List, ListItem, SwipeAction, Button, Space, showToast } from '$lib'
  import { type SwipeActionStatus } from '$lib'
</script>

<script lang="ts">
  let swipeActionStatus = $state<SwipeActionStatus>('close')

  function onclick() {
    showToast({ text: '触发' })
  }
</script>

<Page class="bg-gray-100">
  <List header="搭配列表使用">
    {#each ['A', 'B', 'C'] as txt}
      <SwipeAction>
        <ListItem>{txt}</ListItem>
        {#snippet leftActions()}
          <Button class="border-0" color="primary" block>置顶</Button>
        {/snippet}
        {#snippet rightActions()}
          <Space block --sunp-gap="0px">
            <Button color="cancel" block {onclick}>取消关注</Button>
            <Button color="warning" block {onclick}>免打扰</Button>
            <Button color="danger" block {onclick}>删除</Button>
          </Space>
        {/snippet}
      </SwipeAction>
    {/each}
  </List>
  <List header="图片预览">
    <Space class="bg-white p-4" block --sunp-gap="16px">
      <SwipeAction>
        <img src="/images/sun-parakeet.jpg" alt="小太阳鹦鹉" />
        {#snippet rightActions()}
          <Button color="danger" block {onclick}>删除</Button>
        {/snippet}
      </SwipeAction>
      <SwipeAction>
        <img src="/images/sun-parakeet.jpg" alt="小太阳鹦鹉" />
        {#snippet rightActions()}
          <Button color="danger" block {onclick}>删除</Button>
        {/snippet}
      </SwipeAction>
    </Space>
  </List>
  <List header="手动控制归位逻辑">
    <SwipeAction bind:status={swipeActionStatus} keepOnAction keepOnTouchOutside>
      <ListItem>ABC</ListItem>
      {#snippet leftActions()}
        <Button color="primary" block>置顶</Button>
      {/snippet}
      {#snippet rightActions()}
        <Space block --sunp-gap="0">
          <Button color="cancel" block {onclick}>取消关注</Button>
          <Button color="warning" block {onclick}>免打扰</Button>
          <Button color="danger" block {onclick}>删除</Button>
        </Space>
      {/snippet}
    </SwipeAction>
    <Space block class="bg-white px-4 py-2">
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
  <p>有问题，要改，要用速度求解。手机端按钮点击时可能会无效</p>
</Page>
