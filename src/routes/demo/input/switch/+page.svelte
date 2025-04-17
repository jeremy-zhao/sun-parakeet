<script lang="ts" module>
  import { Page, List, Form, FormItem, Switch, showToast, Icon } from '$lib'
</script>

<script lang="ts">
  let form = $state({
    checked: false,
  })

  function onChange(checked: boolean) {
    showToast({ text: checked.toString() })
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Switch />
    </div>
  </List>
  <List header="有默认值">
    <div class="bg-white p-4">
      <Switch checked {onChange} />
    </div>
  </List>
  <List header="文字和图标">
    <div class="bg-white p-4">
      <Switch checkedText="开" uncheckedText="关" />

      <Switch>
        {#snippet checkedText()}
          <Icon name="check" size={25} class="-mx-1" />
        {/snippet}
        {#snippet uncheckedText()}
          <Icon name="close" size={25} class="-mx-1" />
        {/snippet}
      </Switch>

      <Switch checkedText="1" uncheckedText="0" />
    </div>
  </List>
  <List header="自定义样式">
    <div class="bg-white p-4">
      <Switch
        --sunp-height="36px"
        --sunp-width="60px"
        --sunp-checked-color="var(--sunp-color-success)"
      />
    </div>
  </List>
  <List header="禁用状态">
    <div class="bg-white p-4">
      <Switch disabled />
      <Switch checked disabled />
    </div>
  </List>
  <Form header="表单-水平布局" layout="horizontal">
    <FormItem label="选择">
      <Switch bind:checked={form.checked} />
    </FormItem>
  </Form>
  <Form header="表单-垂直布局" layout="vertical">
    <FormItem label="自动发送微信消息">
      <Switch bind:checked={form.checked} />
    </FormItem>
  </Form>
</Page>
