<script lang="ts">
  import { Page, Tabs, TabPanel, InfiniteScroll, PullToRefresh, List, ListItem, delay } from '$lib'

  let currentTab = $state('基础用法')

  let data = $state<string[]>([])
  let hasMore = $derived(data.length < 26 * 4)

  async function loadMore(retry: boolean) {
    await delay(3000)
    data = [...data, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  }
</script>

{#snippet list()}
  {#each data as item}
    <ListItem>{item}</ListItem>
  {/each}
{/snippet}

<Page class="flex flex-col bg-gray-100">
  <Tabs
    class="flex-none"
    bind:value={currentTab}
    tabs={['基础用法', '下拉刷新']}
    onChange={() => (data = [])}
  />
  <TabPanel class="flex-auto" visible={currentTab === '基础用法'}>
    <InfiniteScroll class="h-full" {hasMore} {loadMore}>
      <List class="bg-white">
        {@render list()}
      </List>
    </InfiniteScroll>
  </TabPanel>
  <TabPanel class="flex-auto" visible={currentTab === '下拉刷新'}>
    <PullToRefresh class="h-full">
      <InfiniteScroll class="h-full">
        <List>
          {@render list()}
        </List>
      </InfiniteScroll>
    </PullToRefresh>
  </TabPanel>
</Page>
