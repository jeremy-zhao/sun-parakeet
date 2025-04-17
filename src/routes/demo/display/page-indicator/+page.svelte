<script lang="ts">
  import { Page, List, PageIndicator } from '$lib'
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <PageIndicator total={4} />
    </div>
  </List>
  <List header="白色">
    <div class="bg-gray-400 p-4">
      <PageIndicator total={4} --sunp-color="white" --sunp-active-color="white" />
    </div>
  </List>
  <List header="竖直方向">
    <div class="bg-white p-4">
      <PageIndicator total={4} direction="vertical" />
    </div>
  </List>
  <List header="自定义颜色和大小">
    <div class="bg-white p-4">
      <PageIndicator
        total={4}
        value={1}
        --sunp-color="rgba(0, 0, 0, 0.4)"
        --sunp-active-color="#ffc0cb"
        --sunp-size="10px"
        --sunp-active-size="30px"
        --sunp-radius="15px"
        --sunp-gap="8px"
      />
    </div>
  </List>
</Page>
