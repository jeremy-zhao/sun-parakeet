<script lang="ts" module>
  import { goto } from '$app/navigation'
  import { Page, List, ListItem } from '$lib'
</script>

<script lang="ts">
  import { onMount } from 'svelte'

  function onNav(e: Event) {
    const target = e.currentTarget as HTMLElement
    if (!target?.dataset.url) return

    goto(target.dataset.url)
  }

  onMount(() => {
    history.scrollRestoration = 'manual'
  })
</script>

{#snippet listItem(text: string, extra: string, url: string)}
  <ListItem clickable={true} onclick={onNav} {extra} data-url={url}>{text}</ListItem>
{/snippet}

<Page class="bg-gray-100">
  <List header="通用组件">
    {@render listItem('Button', '按钮', '/demo/common/button')}
    {@render listItem('Icon', '图标', '/demo/common/icon')}
    {@render listItem('VConsole', '控制台', '/demo/common/vconsole')}
  </List>
  <List header="布局">
    {@render listItem('AutoCenter', '自动居中', '/demo/layout/auto-center')}
    {@render listItem('Divider', '分割线', '/demo/layout/divider')}
    {@render listItem('Page', '页面', '/demo/layout/page')}
    {@render listItem('Space', '间距', '/demo/layout/space')}
  </List>
  <List header="导航">
    {@render listItem('SideBar', '侧边栏', '/demo/navigation/side-bar')}
    {@render listItem('TabBar', '标签栏', '/demo/navigation/tab-bar')}
    {@render listItem('Tabs', '标签页', '/demo/navigation/tabs')}
    {@render listItem('TabPanel', '标签面板', '/demo/navigation/tab-panel')}
  </List>
  <List header="信息展示">
    {@render listItem('Avatar', '头像', '/demo/display/avatar')}
    {@render listItem('Badge', '徽标', '/demo/display/badge')}
    {@render listItem('Card', '卡片', '/demo/display/card')}
    {@render listItem('Collapse', '折叠面板', '/demo/display/collapse')}
    {@render listItem('Image', '图片', '/demo/display/image')}
    {@render listItem('List', '列表', '/demo/display/list')}
    {@render listItem('PageIndicator', '分页符', '/demo/display/page-indicator')}
    {@render listItem('Swiper', '轮播', '/demo/display/swiper')}
  </List>
  <List header="信息录入">
    {@render listItem('CheckList', '可勾选列表', '/demo/input/check-list')}
    {@render listItem('Checkbox', '复选框', '/demo/input/checkbox')}
    {@render listItem('Form', '表单', '/demo/input/form')}
    {@render listItem('Input', '输入框', '/demo/input/input')}
    {@render listItem('Picker', '选择器', '/demo/input/picker')}
    {@render listItem('PickerView', '选择器视图', '/demo/input/picker-view')}
    {@render listItem('Switch', '开关', '/demo/input/switch')}
    {@render listItem('Textarea', '文本域', '/demo/input/textarea')}
  </List>
  <List header="反馈">
    {@render listItem('ActionSheet', '动作面板', '/demo/feedback/action-sheet')}
    {@render listItem('Loading', '加载中', '/demo/feedback/loading')}
    {@render listItem('Popup', '弹出层', '/demo/feedback/popup')}
    {@render listItem('SwipeAction', '滑动操作', '/demo/feedback/swipe-action')}
    {@render listItem('Toast', '轻提示', '/demo/feedback/toast')}
  </List>
</Page>
