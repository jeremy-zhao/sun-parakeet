<script lang="ts" module>
</script>

<script lang="ts">
  import { Page, List, CheckList, CheckListItem, Input, Form, FormItem } from '$lib'

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
  <Form header="表单">
    <FormItem>
      <Input value={form.fruits.toString()} placeholder="已选中的水果" readonly />
    </FormItem>
    <CheckList bind:value={form.fruits} header="可勾选列表" selectAll>
      <CheckListItem value="apple">苹果</CheckListItem>
      <CheckListItem value="orange">橘子</CheckListItem>
      <CheckListItem value="banana">香蕉</CheckListItem>
    </CheckList>
  </Form>
</Page>
