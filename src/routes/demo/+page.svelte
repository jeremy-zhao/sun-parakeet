<script lang="ts" module>
  import { goto } from '$app/navigation'
  import { Page, List, ListItem } from '$lib'
</script>

<script lang="ts">
  function onNav(e: Event) {
    const target = e.currentTarget as HTMLElement
    if (!target?.dataset.url) return

    goto(target.dataset.url)
  }
</script>

{#snippet listItem(text: string, extra: string, url: string)}
  <ListItem clickable={true} onclick={onNav} {extra} data-url={url}>{text}</ListItem>
{/snippet}

<Page class="bg-gray-100">
  <List header="通用组件">
    {@render listItem('Button', '按钮', '/demo/common/button')}
    {@render listItem('Icon', '图标', '/demo/common/icon')}
  </List>
  <List header="布局">
    {@render listItem('AutoCenter', '自动居中', '/demo/layout/auto-center')}
    {@render listItem('Divider', '分割线', '/demo/layout/divider')}
  </List>
  <List header="信息展示">
    {@render listItem('Avatar', '头像', '/demo/display/avatar')}
    {@render listItem('Card', '卡片', '/demo/display/card')}
    {@render listItem('Collapse', '折叠面板', '/demo/display/collapse')}
    {@render listItem('List', '列表', '/demo/display/list')}
  </List>
</Page>
