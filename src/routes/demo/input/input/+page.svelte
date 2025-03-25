<script lang="ts" module>
  import { Page, List, ListItem, Input } from '$lib'
</script>

<script lang="ts">
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Input />
    </div>
  </List>
  <List header="带清除按钮">
    <div class="bg-white p-4">
      <Input clearable />
    </div>
  </List>
  <List header="输入内容右对齐">
    <div class="bg-white p-4">
      <Input --text-align="right" placeholder="请输入验证码" clearable />
    </div>
  </List>
  <List header="只读状态">
    <div class="bg-white p-4">
      <Input readonly value="输入框的内容是只读的" />
    </div>
  </List>
  <List header="禁用状态">
    <div class="bg-white p-4">
      <Input disabled value="被禁用的输入框" />
    </div>
  </List>
  <List header="查看密码">
    <div class="bg-white p-4">
      <Input type="password" placeholder="请输入密码" clearable />
    </div>
  </List>
</Page>
