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
        class="bg-gray-50"
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '待办' },
          { value: 'customer', icon: 'customer', label: '客户' },
          { value: 'share', icon: 'share', label: '分享' },
          { value: 'report', icon: 'report', label: '报表' },
        ]}
      />
    </List>
    <List header="徽标">
      <TabBar
        class="bg-gray-50"
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '待办', badge: true },
          { value: 'customer', icon: 'customer', label: '客户', badge: 5 },
          { value: 'share', icon: 'share', label: '分享', badge: 100 },
          { value: 'report', icon: 'report', label: '报表', badge: '新消息' },
        ]}
      />
    </List>
    <List header="仅图标">
      <TabBar
        class="bg-gray-50"
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', badge: true },
          { value: 'customer', icon: 'customer' },
          { value: 'share', icon: 'share' },
          { value: 'report', icon: 'report' },
        ]}
      />
    </List>
    <List header="仅标题-背景">
      <TabBar class="bg-purple-100" tabs={['待办', '客户', '分享', '报表']} />
    </List>
    <List header="禁用">
      <TabBar
        class="bg-gray-50"
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '待办' },
          { value: 'customer', icon: 'customer', label: '客户' },
          { value: 'share', icon: 'share', label: '分享' },
          { value: 'report', icon: 'report', label: '报表', badge: '新消息', disabled: true },
        ]}
      />
    </List>
    <List header="底部"></List>
  </div>
  <TabBar
    class="bg-gray-50"
    bind:value={selectedTab}
    fixed
    tabs={[
      { value: 'todoList', icon: 'todo-list', label: '待办', badge: true },
      { value: 'customer', icon: 'customer', label: '客户' },
      { value: 'share', icon: 'share', label: '分享' },
      { value: 'report', icon: 'report', label: '报表' },
    ]}
  />
</Page>
