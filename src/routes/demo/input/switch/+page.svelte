<script lang="ts" module>
  import { Page, List, Switch, showToast, Icon } from '$lib'
</script>

<script lang="ts">
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
      <Switch --sp-height="36px" --sp-width="60px" --sp-checked-color="#00b578" />
    </div>
  </List>
</Page>
