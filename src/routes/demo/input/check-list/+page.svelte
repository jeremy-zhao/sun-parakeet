<script lang="ts" module>
</script>

<script lang="ts">
  import { Page, List, CheckList, CheckListItem, Button, Form, FormItem, Space } from '$lib'

  let checked = $state(false)

  let form = $state({
    fruits: [],
  })
</script>

<Page class="bg-gray-100 pb-20">
  <List header="CheckListItem 单独使用">
    <CheckListItem>单独使用</CheckListItem>
    <CheckListItem checked>默认选中</CheckListItem>
    <CheckListItem disabled>禁用</CheckListItem>
    <CheckListItem checked disabled>禁用，已勾选</CheckListItem>
  </List>
  <List header="继承自 ListItem 的属性">
    <CheckListItem description="这是一段很长的说明有可能会超过原有的长度或者造成换行">
      {#snippet aside()}
        <div class="h-8 w-8 rounded-full bg-red-600"></div>
      {/snippet}
      <span>列表条目</span>
    </CheckListItem>
  </List>
</Page>
