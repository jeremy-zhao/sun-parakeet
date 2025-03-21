<script lang="ts" module>
  import { Page, List, Button, showLoading, hideLoading, type ShowLoadingOption } from '$lib'
</script>

<script lang="ts">
  function onSubmit(option?: ShowLoadingOption) {
    showLoading(option)

    setTimeout(() => {
      hideLoading()
    }, 2000)
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => onSubmit()}>提交</Button>
    </div>
  </List>
  <List header="说明文字">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => onSubmit({ text: '提交中...' })}>提交</Button>
    </div>
  </List>

  <p>Bug：提交，返回，提交消失，再返回时行为有问题</p>
</Page>
