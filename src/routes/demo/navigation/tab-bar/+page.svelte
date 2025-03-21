<script lang="ts" module>
  import { Page, List, TabBar } from '$lib'
</script>

<script lang="ts">
  let selectedTab = $state('todoList')
</script>

<Page class="bg-white">
  <div class="bg-gray-100">
    <List header="基础用法">
      <TabBar
        bind:value={selectedTab}
        tabs={[
          { key: 'todoList', icon: 'todo-list', text: '待办' },
          { key: 'customer', icon: 'customer', text: '客户' },
          { key: 'share', icon: 'share', text: '分享' },
          { key: 'report', icon: 'report', text: '报表' },
        ]}
      />
    </List>
    <List header="徽标">
      <TabBar
        bind:value={selectedTab}
        tabs={[
          { key: 'todoList', icon: 'todo-list', text: '待办', badge: true },
          { key: 'customer', icon: 'customer', text: '客户', badge: 5 },
          { key: 'share', icon: 'share', text: '分享', badge: 100 },
          { key: 'report', icon: 'report', text: '报表', badge: '新消息' },
        ]}
      />
    </List>
    <List header="仅图标">
      <TabBar
        bind:value={selectedTab}
        tabs={[
          { key: 'todoList', icon: 'todo-list', badge: true },
          { key: 'customer', icon: 'customer' },
          { key: 'share', icon: 'share' },
          { key: 'report', icon: 'report' },
        ]}
      />
    </List>
    <List header="仅标题">
      <TabBar
        bind:value={selectedTab}
        tabs={[
          { key: 'todoList', text: '待办', badge: true },
          { key: 'customer', text: '客户' },
          { key: 'share', text: '分享' },
          { key: 'report', text: '报表' },
        ]}
      />
    </List>
    <List header="禁用">
      <TabBar
        bind:value={selectedTab}
        tabs={[
          { key: 'todoList', icon: 'todo-list', text: '待办' },
          { key: 'customer', icon: 'customer', text: '客户' },
          { key: 'share', icon: 'share', text: '分享' },
          { key: 'report', icon: 'report', text: '报表', badge: '新消息', disabled: true },
        ]}
      />
    </List>
    <List header="底部"></List>
  </div>
  <TabBar
    bind:value={selectedTab}
    fixed
    tabs={[
      { key: 'todoList', icon: 'todo-list', text: '待办', badge: true },
      { key: 'customer', icon: 'customer', text: '客户' },
      { key: 'share', icon: 'share', text: '分享' },
      { key: 'report', icon: 'report', text: '报表' },
    ]}
  />
</Page>
