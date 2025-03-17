<script lang="ts" module>
  import { Page, List, Button, showLoading, hideLoading } from '$lib'
</script>

<script lang="ts">
  function onSubmit() {
    showLoading({ text: '提交中...' })

    setTimeout(() => {
      hideLoading()
    }, 2000)
  }
</script>

<Page class="bg-gray-100">
  <List header="基本用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={onSubmit}>提交</Button>
    </div>
  </List>
</Page>
