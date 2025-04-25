<script lang="ts" module>
  import { Page, List, Tabs } from '$lib'
</script>

<script lang="ts">
  let selectedTab = $state('todoList')

  let tabs = [
    'Espresso',
    'Coffee Latte',
    'Americano',
    'Flat White',
    'Caramel Macchiato',
    'Cafe Mocha',
  ]
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <Tabs
      class="bg-gray-50"
      tabs={[
        { value: 'todoList', icon: 'todo-list', label: '待办' },
        { value: 'customer', icon: 'customer', label: '客户' },
        { value: 'share', icon: 'share', label: '分享' },
        { value: 'report', icon: 'report', label: '报表' },
      ]}
    />
  </List>
  <List header="徽标">
    <Tabs
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
    <Tabs
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
  <List header="仅标题">
    <Tabs
      class="bg-purple-100"
      bind:value={selectedTab}
      tabs={[
        { value: 'todoList', label: '待办', badge: true },
        { value: 'customer', label: '客户' },
        { value: 'share', label: '分享' },
        { value: 'report', label: '报表' },
      ]}
    />
  </List>
  <List header="禁用">
    <Tabs
      class="bg-gray-50"
      tabs={[
        { value: 'todoList', icon: 'todo-list', label: '待办', badge: true, disabled: true },
        { value: 'customer', icon: 'customer', label: '客户' },
        { value: 'share', icon: 'share', label: '分享' },
        { value: 'report', icon: 'report', label: '报表' },
      ]}
    />
  </List>
  <List header="超长滚动">
    <div>
      <Tabs class="bg-gray-50" {tabs} />
    </div>
  </List>
</Page>
