<script lang="ts" module>
  import { Page, Button, Icon, List, Space, delay } from '$lib'

  let loading = $state(false)

  async function handleSubmit() {
    loading = true
    await delay(3000)
    loading = false
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white px-4 py-2">
      <Space wrap>
        <Button class="rounded-full border">👌OK</Button>
        <Button class="rounded" color="primary"><Icon class="mr-1" name="check" />确定</Button>
        <Button color="primary-plain" --sp-border-0>取消</Button>
        <Button color="success">成功</Button>
        <Button color="success-plain">成功</Button>
        <Button color="warning" --sunp-padding="8px 16px">Warning</Button>
        <Button color="warning-plain">警告</Button>
        <Button color="danger">危险</Button>
        <Button color="danger-plain">危险</Button>
        <Button color="cancel">取消</Button>
        <Button color="cancel-plain">取消</Button>
        <Button color="text">文本</Button>
        <div class="bg-orange-200 px-2">
          <Button color="text">文本 + 背景</Button>
        </div>
        <Button color="primary" disabled>禁用</Button>
      </Space>
    </div>
  </List>
  <List header="自定义">
    <style>
      /* purple */
      .sunp-button-purple {
        background-color: #a855f7;
        color: white;

        &:active {
          background-color: #9333ea;
        }
      }

      /* purple-plain */
      .sunp-button-purple-plain {
        color: #9333ea;
        background-color: #f3e8ff;
        border-color: #c084fc;

        &:active {
          background-color: #e9d5ff;
          border-color: #9333ea;
        }
      }
    </style>
    <div class="bg-white px-4 py-2">
      <Space wrap>
        <Button color="purple">紫色</Button>
        <Button color="purple-plain">紫色</Button>
        <Button color="primary-plain" --sunp-border="0">无框</Button>
        <Button color="primary-plain" --sunp-padding-x="32px">超宽</Button>
        <Button color="primary" --sunp-height="50px">超高</Button>
      </Space>
    </div>
  </List>
  <List header="文本混排">
    <p class="bg-white px-4 py-2">
      <span class="mr-2">点击右侧按钮</span>
      <Button color="warning" {loading} onclick={handleSubmit}>提交</Button>
      <span class="ml-2">会转圈圈</span>
    </p>
  </List>
  <List header="块级显示">
    <div class="bg-white px-4 py-2">
      <Button color="primary" block {loading} onclick={handleSubmit}>提交</Button>
    </div>
  </List>
</Page>
