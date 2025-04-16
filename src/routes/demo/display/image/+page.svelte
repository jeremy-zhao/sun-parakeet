<script lang="ts" module>
  import { Page, List, Image, Space } from '$lib'
</script>

<script lang="ts">
  let src = '/images/sun-parakeet.jpg'
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Image {src} />
    </div>
  </List>
  <List header="多种填充模式">
    <div class="bg-white p-4">
      <Space block wrap>
        <Image class="img" {src} fit="fill" />
        <Image class="img" {src} fit="contain" />
        <Image class="img" {src} fit="cover" />
        <Image class="img" {src} fit="scale-down" />
        <Image class="img" {src} fit="none" />
      </Space>
    </div>
  </List>
  <List header="加载失败">
    <div class="bg-white p-4">
      <Image
        src="/404"
        style="width: 100px; height: 100px"
        onerror={() => console.log('图片加载失败')}
      />
    </div>
  </List>
  <List header="懒加载">
    <div class="bg-white p-4">
      <Image {src} loading="lazy" />
    </div>
  </List>
</Page>

<style lang="postcss">
  :global(.img) {
    border: 1px dashed gray;
    width: 100px;
    height: 100px;
  }
</style>
