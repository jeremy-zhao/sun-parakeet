<script lang="ts" module>
</script>

<script lang="ts">
  import { Page, List, CheckList, CheckListItem, Button, Form, FormItem, Space } from '$lib'
  import ListItem from '$lib/display/ListItem.svelte'

  let form = $state({
    fruits: [],
  })
</script>

<Page class="bg-gray-100 pb-20">
  <List header="CheckListItem 单独使用">
    <CheckListItem>单独使用</CheckListItem>
    <CheckListItem checked>默认选中</CheckListItem>
    <CheckListItem checked icon="sun">自定义图标</CheckListItem>
    <CheckListItem disabled>禁用</CheckListItem>
    <CheckListItem checked disabled>禁用，已勾选</CheckListItem>
  </List>
  <CheckList bind:value={form.fruits} header="可勾选列表" selectAll>
    <CheckListItem value="apple">苹果</CheckListItem>
    <CheckListItem value="orange">橘子</CheckListItem>
    <CheckListItem value="banana">香蕉</CheckListItem>
  </CheckList>
  <List>
    <ListItem>{form.fruits}</ListItem>
  </List>
</Page>
