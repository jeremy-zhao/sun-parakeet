<script lang="ts" module>
  import { Page, List, Form, FormItem, Textarea } from '$lib'
</script>

<script lang="ts">
  let value = '床前明月光，\n疑是地上霜。'

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
  <List header="指定行数 3">
    <div class="bg-white p-4">
      <Textarea placeholder="请输入内容" rows={3} />
    </div>
  </List>
  <List header="根据内容自动调整高度">
    <div class="bg-white p-4">
      <Textarea autosize />
    </div>
  </List>
  <List header="显示行数限制 minRows: 1">
    <div class="bg-white p-4">
      <Textarea autosize={{ minRows: 1 }} />
    </div>
  </List>
  <List header="显示行数限制 maxRows: 5">
    <div class="bg-white p-4">
      <Textarea autosize={{ maxRows: 5 }} />
    </div>
  </List>
  <List header="显示行数限制 minRows: 1, maxRows: 5">
    <div class="bg-white p-4">
      <Textarea autosize={{ minRows: 1, maxRows: 5 }} />
    </div>
  </List>
  <List header="字数统计">
    <div class="bg-white p-4">
      <Textarea {value} statistic />
    </div>
  </List>
  <List header="字数限制">
    <div class="bg-white p-4">
      <Textarea {value} statistic maxlength={30} />
    </div>
  </List>
  <List header="只读状态">
    <div class="bg-white p-4">
      <Textarea {value} readonly />
    </div>
  </List>
  <List header="禁用状态">
    <div class="bg-white p-4">
      <Textarea {value} disabled />
    </div>
  </List>
</Page>
