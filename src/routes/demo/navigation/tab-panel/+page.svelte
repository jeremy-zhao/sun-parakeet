<script lang="ts" module>
  import { Page, TabBar, Tabs, TabPanel, AutoCenter } from '$lib'
</script>

<script lang="ts">
  let selectedTabBar = $state('todoList')
  let selectedTabs = $state()
</script>

<Page class="flex flex-col bg-gray-100">
  <TabPanel visible={selectedTabBar === 'todoList'} class="flex flex-1 flex-col bg-white">
    <Tabs bind:value={selectedTabs} tabs={['进行中', '已完成']} />

    <TabPanel visible={selectedTabs === '进行中'} class="flex-1">
      <AutoCenter class="h-full text-center">
        <p>待办</p>
        <p>进行中</p>
      </AutoCenter>
    </TabPanel>

    <TabPanel visible={selectedTabs === '已完成'} class="flex-1">
      <AutoCenter class="h-full text-center">
        <p>待办</p>
        <p>已完成</p>
      </AutoCenter>
    </TabPanel>
  </TabPanel>

  <TabPanel visible={selectedTabBar === 'customer'} class="flex-1 bg-white">
    <AutoCenter class="h-full">客户</AutoCenter>
  </TabPanel>

  <TabPanel visible={selectedTabBar === 'share'} class="flex-1 bg-white">
    <AutoCenter class="h-full">分享</AutoCenter>
  </TabPanel>

  <TabPanel visible={selectedTabBar === 'report'} class="flex-1 bg-white">
    <AutoCenter class="h-full">报表</AutoCenter>
  </TabPanel>

  <TabBar
    class="border-t border-t-gray-200"
    bind:value={selectedTabBar}
    tabs={[
      { value: 'todoList', icon: 'todo-list', label: '待办' },
      { value: 'customer', icon: 'customer', label: '客户' },
      { value: 'share', icon: 'share', label: '分享' },
      { value: 'report', icon: 'report', label: '报表' },
    ]}
  />
</Page>
