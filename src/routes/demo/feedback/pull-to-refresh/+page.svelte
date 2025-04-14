<script lang="ts">
  import { Page, List, PullToRefresh, Tabs, TabPanel, Icon, delay, showToast } from '$lib'

  let count = $state(0)

  let currentTab = $state('基础用法')

  async function handleRefresh() {
    await delay(1000)
    count++

    if (currentTab !== '基础用法') {
      showToast({ text: '刷新成功' })
    }
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
  <Tabs class="flex-none" bind:value={currentTab} tabs={['基础用法', '自定义+震动']} />
  <TabPanel class="flex-auto" visible={currentTab === '基础用法'}>
    <PullToRefresh class="h-full" onRefresh={handleRefresh}>
      {@render content()}
    </PullToRefresh>
  </TabPanel>
  <TabPanel class="flex-auto" visible={currentTab === '自定义+震动'}>
    <PullToRefresh class="h-full" vibrate completeDuration={0} onRefresh={handleRefresh}>
      {@render content()}
      {#snippet header(status, offset)}
        <div class="flex items-center justify-center p-2">
          {#if status === 'refreshing'}
            <Icon
              class="animate-spin rounded-full bg-white p-1 text-blue-600"
              name="refresh"
              size={32}
            />
          {:else}
            <Icon
              class="rounded-full bg-white p-1 {status === 'loosing'
                ? 'text-blue-600'
                : 'text-gray-400'}"
              style="rotate: {offset * 5}deg"
              name="reset-right"
              size={32}
            />
          {/if}
        </div>
      {/snippet}
    </PullToRefresh>
  </TabPanel>
</Page>
