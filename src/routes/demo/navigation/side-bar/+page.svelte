<script lang="ts" module>
  import { Page, List, SideBar, TabPanel } from '$lib'
</script>

<script lang="ts">
  let selectedTab = $state('todoList')
</script>

{#snippet panels()}
  <TabPanel
    class="flex flex-auto items-center justify-center bg-white"
    visible={selectedTab === 'todoList'}
  >
    <div>待办</div>
  </TabPanel>
  <TabPanel
    class="flex flex-auto items-center justify-center bg-white"
    visible={selectedTab === 'customer'}
  >
    <div>客户</div>
  </TabPanel>
  <TabPanel
    class="flex flex-auto items-center justify-center bg-white"
    visible={selectedTab === 'share'}
  >
    <div>分享</div>
  </TabPanel>
  <TabPanel
    class="flex flex-auto items-center justify-center bg-white"
    visible={selectedTab === 'report'}
  >
    <div>报表</div>
  </TabPanel>
{/snippet}

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="flex items-stretch justify-stretch" style="height: 220px">
      <SideBar
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '待办' },
          { value: 'customer', icon: 'customer', label: '客户' },
          { value: 'share', icon: 'share', label: '分享' },
          { value: 'report', icon: 'report', label: '报表' },
        ]}
      />
      {@render panels()}
    </div>
  </List>
  <List header="徽标-定宽">
    <div class="flex items-stretch justify-stretch">
      <SideBar
        style="width: 100px;"
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '我的待办', badge: true },
          { value: 'customer', icon: 'customer', label: '客户', badge: 5 },
          { value: 'share', icon: 'share', label: '分享', badge: 100 },
          { value: 'report', icon: 'report', label: '报表', badge: '新消息' },
        ]}
      />
      {@render panels()}
    </div>
  </List>
  <List header="仅图标-方角">
    <div class="flex items-stretch justify-stretch">
      <SideBar
        bind:value={selectedTab}
        tabs={[
          { value: 'todoList', icon: 'todo-list', badge: true },
          { value: 'customer', icon: 'customer' },
          { value: 'share', icon: 'share' },
          { value: 'report', icon: 'report' },
        ]}
        --sunp-radius="0"
      />
      {@render panels()}
    </div>
  </List>
  <List header="仅标题-定宽-背景">
    <div class="flex items-stretch justify-stretch">
      <SideBar
        class="bg-purple-100"
        style="width: 140px"
        tabs={['待办', '客户', '分享', '报表文本长度过长会导致折行']}
      />
      <div class="flex flex-auto items-center justify-center bg-white">左侧 tabs 为字符串数组</div>
    </div>
  </List>
  <List header="禁用">
    <div class="flex items-stretch justify-stretch">
      <SideBar
        tabs={[
          { value: 'todoList', icon: 'todo-list', label: '待办', badge: true, disabled: true },
          { value: 'customer', icon: 'customer', label: '客户' },
          { value: 'share', icon: 'share', label: '分享' },
          { value: 'report', icon: 'report', label: '报表' },
        ]}
      />
      {@render panels()}
    </div>
  </List>
</Page>
