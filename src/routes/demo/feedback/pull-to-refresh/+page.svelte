<script lang="ts">
  import { Page, List, PullToRefresh, Tabs, TabPanel, delay } from '$lib'

  let count = $state(0)

  let currentTab = $state('基础用法')

  async function handleRefresh() {
    await delay(1000)
    count++
  }
</script>

{#snippet content()}
  <List>
    {#each new Array(20)}
      <p class="bg-white p-4">刷新次数: {count}</p>
    {/each}
  </List>
{/snippet}

<Page class="flex flex-col bg-gray-100">
  <Tabs class="flex-none" bind:value={currentTab} tabs={['基础用法', '自定义-震动反馈']} />
  <TabPanel class="flex-auto " visible={currentTab === '基础用法'}>
    <PullToRefresh class="h-full" onRefresh={handleRefresh}>
      {@render content()}
    </PullToRefresh>
  </TabPanel>
  <TabPanel class="flex-auto " visible={currentTab === '自定义-震动反馈'}>
    <PullToRefresh class="h-full" vibrate onRefresh={handleRefresh}>
      {@render content()}
    </PullToRefresh>
  </TabPanel>
</Page>
