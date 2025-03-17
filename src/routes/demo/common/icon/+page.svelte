<script lang="ts" module>
  import { Page, Icon, List } from '$lib'
</script>

<Page class="bg-gray-100">
  <List header="基本用法">
    <div class="bg-white px-4 py-2">
      <Icon name="arrow-down-s-line" />
      <Icon name="arrow-right-s-line" />
    </div>
  </List>
  <List header="大小">
    <div class="bg-white px-4 py-2">
      <Icon name="arrow-down-s-line" size={24} />
      <Icon name="arrow-down-s-line" size={28} />
      <Icon name="arrow-down-s-line" size={32} />
      <Icon name="arrow-down-s-line" size={36} />
    </div>
  </List>
  <List header="颜色">
    <div class="bg-white px-4 py-2">
      <Icon name="arrow-down-s-line" style="color: red" />
      <Icon name="arrow-down-s-line" class="text-blue-600" />
    </div>
  </List>
</Page>
