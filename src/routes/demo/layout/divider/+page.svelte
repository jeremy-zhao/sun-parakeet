<script lang="ts" module>
  import { Page, List, Divider } from '$lib'
</script>

<Page class="bg-gray-100">
  <List header="基础分割线">
    <div class="bg-white py-4">
      <Divider />
    </div>
  </List>
  <List header="带内容的分割线">
    <div class="bg-white py-2">
      <Divider class="py-2">内容默认在中间</Divider>
      <Divider class="py-2" contentPosition="left">左侧内容</Divider>
      <Divider class="py-2" contentPosition="right">右侧内容</Divider>
    </div>
  </List>
  <List header="自定义样式">
    <div class="bg-white py-2">
      <Divider style="color: #1677ff; border-color: #1677ff; border-style: dashed">自定义样式</Divider>
    </div>
  </List>
  <List header="自定义样式">
    <p class="bg-white text-center text-[24px]">
      <span>Text</span>
      <Divider direction="vertical" />
      <a class="text-blue-600 underline" href="./divider">Link</a>
      <Divider direction="vertical" />
      <a class="text-blue-600 underline" href="./divider">Link</a>
    </p>
  </List>
</Page>
