<script lang="ts" module>
  import { Page, List, ListItem, Checkbox, CheckboxGroup, Form, FormItem } from '$lib'
</script>

<script lang="ts">
  let username = $state('')

  function handleChange(value: string) {
    console.log('changed', value)
  }
</script>

<Page class="bg-gray-100 pb-20">
  <List header="基础用法">
    <ListItem>
      <Checkbox />
    </ListItem>
    <ListItem>
      <Checkbox>有描述的复选框</Checkbox>
    </ListItem>
  </List>
  <List header="默认选中">
    <ListItem>
      <Checkbox checked>默认选中</Checkbox>
    </ListItem>
  </List>
  <List header="复选框组">
    <ListItem>
      <CheckboxGroup>
        <Checkbox value="apple">苹果</Checkbox>
        <Checkbox value="orange">橘子</Checkbox>
        <Checkbox value="banana">香蕉</Checkbox>
      </CheckboxGroup>
    </ListItem>
  </List>
</Page>
