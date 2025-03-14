<script lang="ts" module>
  import { Page, Divider } from '$lib'
</script>

<Page class="bg-gray-100">
  <h1 class="px-4 py-2">基础分割线</h1>
  <p class="bg-white py-4">
    <Divider />
  </p>
  <h1 class="px-4 py-2">带内容的分割线</h1>
  <p class="bg-white py-2">
    <Divider>内容默认在中间</Divider>
  </p>
  <p class="bg-white py-2">
    <Divider contentPosition="left">左侧内容</Divider>
  </p>
  <p class="bg-white py-2">
    <Divider contentPosition="right">右侧内容</Divider>
  </p>
  <h1 class="px-4 py-2">自定义样式</h1>
  <p class="bg-white py-2">
    <Divider style="color: #1677ff; border-color: #1677ff; border-style: dashed">自定义样式</Divider>
  </p>
  <h1 class="px-4 py-2">竖向分割线</h1>
  <p class="bg-white text-center text-[24px]">
    <span>Text</span>
    <Divider direction="vertical" />
    <a class="text-blue-600 underline" href="./divider">Link</a>
    <Divider direction="vertical" />
    <a class="text-blue-600 underline" href="./divider">Link</a>
  </p>
</Page>
