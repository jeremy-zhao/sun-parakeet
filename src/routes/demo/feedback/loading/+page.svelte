<script lang="ts" module>
  import { Page, List, Button, showLoading, hideLoading, delay, type ShowLoadingOption } from '$lib'
</script>

<script lang="ts">
  async function loading(option?: ShowLoadingOption, duration: number = 2000) {
    showLoading(option)

    try {
      await delay(duration)
    } finally {
      hideLoading()
    }
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => loading()}>提交</Button>
    </div>
  </List>
  <List header="自定义">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => loading({ text: '提交中...' })}>说明文字</Button>
      <Button class="border" onclick={() => loading({ text: '提交中...', icon: 'loader' })}
        >自定义图标</Button
      >
    </div>
  </List>
  <List header="并行执行">
    <div class="bg-white p-4">
      <Button
        class="border"
        onclick={() => {
          Promise.all([loading({ text: '加载中...' }), loading({ text: '加载中...' }, 3000)])
        }}>加载</Button
      >
    </div>
  </List>
</Page>
