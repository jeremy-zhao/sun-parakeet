<script lang="ts" module>
  import { Page, List, Form, FormItem, Textarea } from '$lib'
</script>

<script lang="ts">
  let form = $state({
    remark: '',
  })
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Textarea placeholder="请输入内容" />
    </div>
  </List>
  <List header="指定行数">
    <div class="bg-white p-4">
      <Textarea placeholder="请输入内容" rows={5} />
    </div>
  </List>
  <List header="根据内容自动调整高度">
    <div class="bg-white p-4">
      <Textarea />
    </div>
  </List>
  <List header="字数统计">
    <div class="bg-white p-4">
      <Textarea />
    </div>
  </List>
  <List header="字数限制">
    <div class="bg-white p-4">
      <Textarea />
    </div>
  </List>
  <List header="只读状态">
    <div class="bg-white p-4">
      <Textarea />
    </div>
  </List>
  <List header="禁用状态">
    <div class="bg-white p-4">
      <Textarea />
    </div>
  </List>
</Page>
