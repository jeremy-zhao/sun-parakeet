<script lang="ts" module>
  import { Page, Input, Form, FormItem } from '$lib'
</script>

<script lang="ts">
  let username = $state('')

  function handleChange(value: string) {
    console.log('changed', value)
  }
</script>

<Page class="bg-gray-100 pb-20">
  <Form header="表单-水平布局" layout="horizontal" --sunp-label-width="80px">
    <FormItem label="用户名" for="username" rules={[{ required: true }]}>
      <Input
        id="username"
        bind:value={username}
        placeholder="请输入用户名"
        autocomplete="username"
      />
    </FormItem>
    <FormItem label="密码" rules={[{ required: true }]}>
      <Input
        id="password"
        type="password"
        placeholder="请输入密码"
        autocomplete="current-password"
      />
    </FormItem>
  </Form>
  <Form header="表单-垂直布局">
    <FormItem label="用户名" for="username" rules={[{ required: true }]}>
      <Input id="username" bind:value={username} placeholder="请输入用户名" />
    </FormItem>
    <FormItem label="密码" rules={[{ required: true }]}>
      <Input id="password" type="password" placeholder="请输入密码" />
    </FormItem>
  </Form>
</Page>
