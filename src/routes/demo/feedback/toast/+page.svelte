<script lang="ts">
  import { Page, Button, List, showToast, hideToast, modifyToast } from '$lib'

  let interval: NodeJS.Timeout | null

  function countdown() {
    if (interval) return

    let second = 5

    interval = setInterval(() => {
      second--
      modifyToast({ text: `剩余 ${second} 秒` })

      if (second <= 0) {
        hideToast()
        interval && clearInterval(interval)
        interval = null
      }
    }, 1000)

    showToast({
      duration: 0,
      icon: { name: 'loading', class: 'animate-spin', size: 32 },
      text: `剩余 ${second} 秒`,
      keep: true,
    })
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => showToast({ text: '轻提示' })}>轻提示</Button>
    </div>
  </List>
  <List header="图标">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => showToast({ text: 'Github', icon: 'github' })}
        >带图标</Button
      >
    </div>
  </List>
  <List header="更多功能">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => showToast({ text: '带遮罩', mask: true })}
        >带遮罩</Button
      >
      <Button
        class="border"
        onclick={() => showToast({ text: '点击/返回 不会关闭', mask: true, keep: true })}
        >点击/返回 不会关闭</Button
      >
    </div>
  </List>
  <List header="手动清除">
    <div class="bg-white p-4">
      <Button
        class="border"
        onclick={() => showToast({ text: '不会自动关闭', duration: 0, keep: true })}
        >打开轻提示</Button
      >
      <Button class="border" onclick={() => hideToast()}>关闭轻提示</Button>
    </div>
  </List>
  <List header="倒计时">
    <div class="bg-white p-4">
      <Button class="border" onclick={countdown}>开始倒计时</Button>
    </div>
  </List>
</Page>
