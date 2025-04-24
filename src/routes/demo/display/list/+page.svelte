<script lang="ts" module>
  import { Page, Avatar, List, ListItem, Space, Button } from '$lib'
</script>

<script lang="ts">
  let clickable = $state(true)

  let avatars = [
    'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
    'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  ]
</script>

<Page class="bg-gray-100">
  <List>
    {#each ['A', 'B', 'C'] as txt}
      <div class="bg-white py-2 pl-4">{txt}</div>
    {/each}
    <Space class="bg-white py-2 pl-4" block wrap>
      <Button>按钮</Button>
      <Button>按钮</Button>
      <Button>按钮</Button>
    </Space>
  </List>
  <List>
    <ListItem>
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
    <ListItem header="条目标题" icon="arrow-down-s-line">
      <span>列表条目</span>
    </ListItem>
    <ListItem description="这是一段很长的说明有可能会超过原有的长度或者造成换行">
      {#snippet aside()}
        <Avatar src={avatars[0]} />
      {/snippet}
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
  </List>
  <List header="列表标题">
    <ListItem {clickable}>
      {#snippet aside()}
        <Avatar src={avatars[1]} />
      {/snippet}
      <span>列表条目</span>
    </ListItem>
    <ListItem {clickable} header="条目标题">
      {#snippet aside()}
        <Avatar src={avatars[2]} />
      {/snippet}
      <span>列表条目</span>
    </ListItem>
    <ListItem {clickable} description="这是一段很长的说明有可能会超过原有的长度或者造成换行">
      {#snippet aside()}
        <Avatar src={avatars[3]} />
      {/snippet}
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
  </List>
</Page>
