<script lang="ts" module>
  import { Page, List, ListItem, SwipeAction, Button, Space } from '$lib'
</script>

<script lang="ts">
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
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
</Page>
