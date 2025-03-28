<script lang="ts" module>
  import { Page, List, Divider } from '$lib'
</script>

<script lang="ts">
  const texts = ['新疆维吾尔自治区', '博尔塔拉蒙古自治州', '阿拉山口市']
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
    <p class="bg-white text-center" style="font-size: 24px; line-height: 36px">
      <span>Text</span>
      <Divider direction="vertical" />
      <a class="text-blue-600 underline" href="./divider">Link</a>
      <Divider direction="vertical" />
      <a class="text-blue-600 underline" href="./divider">Link</a>
    </p>
  </List>
  <List header="换行">
    <p class="bg-white px-4 py-2" style="font-size: 17px;">
      <span>新疆维吾尔自治区</span>
      <Divider direction="vertical" />
      <span>博尔塔拉蒙古自治州</span>
      <Divider direction="vertical" />
      <span>阿拉山口市</span>
    </p>
  </List>
  <List header="换行2">
    <p class="bg-white px-4 py-2" style="font-size: 17px;">
      {#each texts as text, index}
        <span>{text}</span>{#if index < texts.length - 1}<Divider direction="vertical" />{/if}
      {/each}
    </p>
  </List>
</Page>
