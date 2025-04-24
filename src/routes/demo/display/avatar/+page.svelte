<script lang="ts" module>
  import { Page, List, ListItem, Avatar, Space, showToast } from '$lib'
</script>

<script lang="ts">
  let avatars = [
    'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
    'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  ]

  function handleClick() {
    showToast({ text: '头像被点击' })
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <Space class="bg-white p-4" block>
      <Avatar src={avatars[0]} shape="circle" />
      <Avatar src={avatars[1]} shape="rounded" />
      <Avatar src={avatars[2]} shape="square" />
      <Avatar src={avatars[3]} shape={12} />
    </Space>
  </List>
  <List header="点击事件">
    <Space class="bg-white p-4" block>
      <Avatar src={avatars[0]} shape="circle" onClick={handleClick} />
    </Space>
  </List>
  <List header="占位头像">
    <Space class="bg-white p-4" direction="vertical" block>
      <Avatar src="" />
      <p>如果你不传图片，或者图片加载失败，那么会显示一个默认的图像</p>
    </Space>
  </List>
  <List header="自定义尺寸">
    <Space class="bg-white p-4" block>
      <Avatar src={avatars[0]} size={32} />
      <Avatar src={avatars[0]} size="48px" />
      <Avatar src={avatars[0]} size="4em" />
    </Space>
  </List>
  <List header="配合列表使用">
    <ListItem description="Deserunt dolor ea eaque eos">
      {#snippet aside()}
        <Avatar src={avatars[0]} />
      {/snippet}
      Novalee Spicer
    </ListItem>
  </List>
</Page>

<style lang="postcss">
  :global(.sp-img) {
    border: 1px dashed gray;
    width: 100px;
    height: 100px;
  }
</style>
