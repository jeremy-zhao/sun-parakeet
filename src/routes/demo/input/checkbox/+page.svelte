<script lang="ts" module>
  import { Page, List, ListItem, Checkbox, CheckboxGroup, Button, Form, FormItem } from '$lib'
</script>

<script lang="ts">
  let checked = $state(false)

  let form = $state({
    fruits: [],
  })
</script>

<Page class="bg-gray-100 pb-20">
  <List header="基础用法">
    <ListItem>
      <Checkbox bind:checked />
    </ListItem>
    <ListItem>
      <Checkbox bind:checked>有描述的复选框</Checkbox>
    </ListItem>
  </List>
  <List header="默认选中">
    <ListItem>
      <Checkbox checked>默认选中</Checkbox>
    </ListItem>
  </List>
  <Form header="配合表单使用-水平布局-复选框组" layout="horizontal">
    <FormItem label="喜欢的水果" rules={[{ required: true }]}>
      <CheckboxGroup bind:value={form.fruits}>
        <Checkbox value="apple">苹果</Checkbox>
        <Checkbox value="orange">橘子</Checkbox>
        <Checkbox value="banana">香蕉</Checkbox>
      </CheckboxGroup>
    </FormItem>
    <div class="px-4 py-2">
      <Button
        onclick={() => {
          form.fruits = []
        }}>清除</Button
      >
    </div>
  </Form>
  <Form header="配合表单使用-垂直布局-复选框组" layout="vertical">
    <FormItem label="喜欢的水果" rules={[{ required: true }]}>
      <CheckboxGroup bind:value={form.fruits} direction="vertical">
        <Checkbox value="apple">苹果</Checkbox>
        <Checkbox value="orange">橘子</Checkbox>
        <Checkbox value="banana">香蕉</Checkbox>
      </CheckboxGroup>
    </FormItem>
  </Form>
</Page>
