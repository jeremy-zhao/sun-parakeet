<script lang="ts" module>
</script>

<script lang="ts">
  import { Page, List, ListItem, Checkbox, CheckboxGroup, Button, Form, FormItem, Space } from '$lib'

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
    <ListItem>
      <Checkbox checked>默认选中</Checkbox>
    </ListItem>
    <ListItem>
      <Space>
        <Checkbox disabled>禁用</Checkbox>
        <Checkbox checked disabled>选中</Checkbox>
      </Space>
    </ListItem>
    <ListItem>
      <Checkbox icon="sun">自定义图标</Checkbox>
    </ListItem>
  </List>
  <Form header="表单-水平布局-复选框组" layout="horizontal">
    <FormItem label="喜欢的水果" rules={[{ required: true }]}>
      <CheckboxGroup bind:value={form.fruits}>
        <Checkbox value="apple">苹果</Checkbox>
        <Checkbox value="orange">橘子</Checkbox>
        <Checkbox value="banana">香蕉</Checkbox>
      </CheckboxGroup>
    </FormItem>
    <div class="bg-white px-4 py-2">
      <Button
        onclick={() => {
          form.fruits = []
        }}>清除</Button
      >
    </div>
  </Form>
  <Form header="表单-垂直布局-复选框组-全选与半选" layout="vertical">
    <FormItem label="喜欢的水果" rules={[{ required: true }]}>
      <CheckboxGroup bind:value={form.fruits} direction="vertical" selectAll>
        <Checkbox value="apple">苹果</Checkbox>
        <Checkbox value="orange">橘子</Checkbox>
        <Checkbox value="banana">香蕉</Checkbox>
      </CheckboxGroup>
    </FormItem>
  </Form>
</Page>
