<script lang="ts" module>
  import { Page, Button, Icon, List, Space, delay } from '$lib'

  let loading = $state(false)

  async function handleSubmit() {
    loading = true
    await delay(5000)
    loading = false
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <Space class="bg-white px-4 py-2" block wrap>
      <Button class="rounded-full">👌OK</Button>
      <Button class="rounded" color="primary"><Icon class="mr-1" name="check" />确定</Button>
      <Button color="primary-plain">取消</Button>
      <Button color="success">成功</Button>
      <Button color="success-plain">成功</Button>
      <Button color="warning">警告</Button>
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
    <Space class="bg-white px-4 py-2" block wrap>
      <Button color="purple">紫色</Button>
      <Button color="purple-plain">紫色</Button>
      <Button color="primary-plain" --sunp-border="0px">无框</Button>
      <Button color="primary-plain" --sunp-padding-x="32px">超宽</Button>
      <Button color="primary" --sunp-height="50px">超高</Button>
    </Space>
  </List>
  <List header="文本混排">
    <p class="bg-white px-4 py-2">
      <span class="mr-2">左侧</span>
      <Button>按钮</Button>
      <span class="mx-2">中间</span>
      <Button>按钮</Button>
      <span class="ml-2">右侧</span>
    </p>
  </List>
  <List header="加载中">
    <Space class="bg-white px-4 py-2" block wrap>
      <Button class="rounded-full" {loading} onclick={handleSubmit}>👌OK</Button>
      <Button class="rounded" color="primary" {loading} onclick={handleSubmit}>确定</Button>
      <Button color="primary-plain" {loading} onclick={handleSubmit}>取消</Button>
      <Button color="success" {loading} onclick={handleSubmit}>成功</Button>
      <Button color="success-plain" {loading} onclick={handleSubmit}>成功</Button>
      <Button color="warning" {loading} onclick={handleSubmit}>警告</Button>
      <Button color="warning-plain" {loading} onclick={handleSubmit}>警告</Button>
      <Button color="danger" {loading} onclick={handleSubmit}>危险</Button>
      <Button color="danger-plain" {loading} onclick={handleSubmit}>危险</Button>
      <Button color="cancel" {loading} onclick={handleSubmit}>取消</Button>
      <Button color="cancel-plain" {loading} onclick={handleSubmit}>取消</Button>
      <Button color="text" {loading} onclick={handleSubmit}>文本</Button>
    </Space>
  </List>
  <List header="块级显示">
    <div class="box-border bg-white px-4 py-2" style="height: 60px">
      <Button color="primary" block {loading} onclick={handleSubmit}>提交</Button>
    </div>
  </List>
</Page>
