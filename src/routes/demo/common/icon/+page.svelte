<script lang="ts" module>
  import { Page, Icon, List } from '$lib'
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white px-4 py-2">
      <Icon name="github" />
    </div>
  </List>
  <List header="大小">
    <div class="bg-white px-4 py-2">
      <Icon name="github" size={24} />
      <Icon name="github" size={28} />
      <Icon name="github" size={32} />
      <Icon name="github" size={36} />
    </div>
  </List>
  <List header="颜色">
    <div class="bg-white px-4 py-2">
      <Icon name="github" style="fill: red" />
      <Icon name="github" class="fill-blue-600" />
    </div>
  </List>
</Page>
