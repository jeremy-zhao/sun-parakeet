<script lang="ts" module>
  import { Page, Button, List, showToast, type ShowToastOption, hideToast } from '$lib'
</script>

<script lang="ts">
  function onToast(option: ShowToastOption) {
    showToast(option)
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
      <Button class="border" onclick={() => showToast({ text: 'Github', icon: 'github' })}>带图标</Button>
    </div>
  </List>
  <List header="更多功能">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => showToast({ text: '带遮罩', mask: true })}>带遮罩</Button>
      <Button class="border" onclick={() => showToast({ text: '点击/返回 不会关闭', mask: true, keep: true })}
        >点击/返回 不会关闭</Button
      >
    </div>
  </List>
  <List header="手动清除">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => showToast({ text: '不会自动关闭', duration: 0, keep: true })}
        >打开轻提示</Button
      >
      <Button class="border" onclick={() => hideToast()}>关闭轻提示</Button>
    </div>
  </List>
</Page>
