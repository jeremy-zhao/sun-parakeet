<script lang="ts">
  import { Page, Tabs, TabPanel, InfiniteScroll, PullToRefresh } from '$lib'
  import { List, ListItem, Divider, Button, Icon, delay } from '$lib'

  let currentTab = $state('基础用法')

  let data = $state<string[]>([])
  let hasMore = $derived(data.length < 26 * 2)
  let hasError = $state(false)

  async function handleSwitch() {
    data = []
    hasError = false
  }

  async function loadMore(retry: boolean) {
    await delay(1000)
    data = [...data, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  }

  async function loadMoreError(retry: boolean) {
    await delay(1000)
    if (!retry && data.length === 26 * 0) throw new Error('HTTP Response Error 500')
    data = [...data, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  }

  async function handleRefresh() {
    await delay(1000)
    data = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
    hasError = false
  }
</script>

{#snippet list()}
  {#each data as item}
    <ListItem>{item}</ListItem>
  {/each}
{/snippet}

<Page class="flex flex-col bg-gray-100">
  <Tabs
    class="flex-none border-b"
    bind:value={currentTab}
    tabs={['基础用法', '下拉刷新', '加载失败', '自定义']}
    onChange={handleSwitch}
  />
  <TabPanel class="flex-auto" visible={currentTab === '基础用法'}>
    <InfiniteScroll class="-mt-[1px] h-full" {hasMore} {loadMore}>
      <List class="bg-white">
        {@render list()}
      </List>
    </InfiniteScroll>
  </TabPanel>
  <TabPanel class="flex-auto" visible={currentTab === '下拉刷新'}>
    <PullToRefresh class="-mt-[1px] h-full" onRefresh={handleRefresh}>
      <InfiniteScroll class="h-full" {hasMore} {loadMore}>
        <List class="bg-white">
          {@render list()}
        </List>
      </InfiniteScroll>
    </PullToRefresh>
  </TabPanel>
  <TabPanel class="flex-auto" visible={currentTab === '加载失败'}>
    <InfiniteScroll class="-mt-[1px] h-full" bind:hasError {hasMore} loadMore={loadMoreError}>
      <List class="bg-white">
        {@render list()}
      </List>
    </InfiniteScroll>
  </TabPanel>
  <TabPanel class="flex-auto" visible={currentTab === '自定义'}>
    <PullToRefresh class="-mt-[1px] h-full " onRefresh={handleRefresh} completeDuration={0}>
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
      <InfiniteScroll class="h-full" bind:hasError {hasMore} loadMore={loadMoreError}>
        <List class="bg-white">
          {@render list()}
        </List>
        {#snippet footer(status, reload)}
          <div class="flex items-center justify-center" style="height: 50px">
            {#if status === 'idle' || status === 'loading'}
              <Icon
                class="animate-spin rounded-full bg-white p-1 text-blue-600"
                name="refresh"
                size={32}
              />
            {:else if status === 'finished'}
              <Divider
                class="flex-auto"
                style="color: #1677ff; border-color: #1677ff; border-style: dashed"
                >我是有底线的</Divider
              >
            {:else if status == 'error'}
              <Button color="danger-plain" block --sunp-border="0" onclick={reload}
                >加载失败，点击重试</Button
              >
            {/if}
          </div>
        {/snippet}
      </InfiniteScroll>
    </PullToRefresh>
  </TabPanel>
</Page>
