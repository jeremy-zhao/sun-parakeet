<script lang="ts" module>
  import { goto } from '$app/navigation'
  import { Page, ListItem, Collapse } from '$lib'
</script>

<script lang="ts">
  import { onMount, tick } from 'svelte'

  let page = $state<HTMLElement>()

  let expanded = $state('')

  let data = [
    {
      header: '通用组件',
      items: [
        ['Button', '按钮', '/demo/common/button'],
        ['Icon', '图标', '/demo/common/icon'],
        ['VConsole', '控制台', '/demo/common/vconsole'],
      ],
    },
    {
      header: '布局',
      items: [
        ['AutoCenter', '自动居中', '/demo/layout/auto-center'],
        ['Divider', '分割线', '/demo/layout/divider'],
        ['Page', '页面', '/demo/layout/page'],
        ['Space', '间距', '/demo/layout/space'],
      ],
    },
    {
      header: '导航',
      items: [
        ['SideBar', '侧边栏', '/demo/navigation/side-bar'],
        ['TabBar', '标签栏', '/demo/navigation/tab-bar'],
        ['Tabs', '标签页', '/demo/navigation/tabs'],
        ['TabPanel', '标签面板', '/demo/navigation/tab-panel'],
      ],
    },
    {
      header: '信息展示',
      items: [
        ['Avatar', '头像', '/demo/display/avatar'],
        ['Badge', '徽标', '/demo/display/badge'],
        ['Collapse', '折叠面板', '/demo/display/collapse'],
        ['Image', '图片', '/demo/display/image'],
        ['InfiniteScroll', '无限滚动', '/demo/display/infinite-scroll'],
        ['List', '列表', '/demo/display/list'],
        ['PageIndicator', '分页符', '/demo/display/page-indicator'],
        ['Steps', '步骤条', '/demo/display/steps'],
        ['Swiper', '轮播', '/demo/display/swiper'],
      ],
    },
    {
      header: '信息录入',
      items: [
        ['Checkbox', '复选框', '/demo/input/checkbox'],
        ['CheckList', '可勾选列表', '/demo/input/check-list'],
        ['Form', '表单', '/demo/input/form'],
        ['Input', '输入框', '/demo/input/input'],
        ['Picker', '选择器', '/demo/input/picker'],
        ['PickerView', '选择器视图', '/demo/input/picker-view'],
        ['Stepper', '步进器', '/demo/input/stepper'],
        ['Switch', '开关', '/demo/input/switch'],
        ['Textarea', '文本域', '/demo/input/textarea'],
      ],
    },
    {
      header: '反馈',
      items: [
        ['ActionSheet', '动作面板', '/demo/feedback/action-sheet'],
        ['Loading', '加载中', '/demo/feedback/loading'],
        ['Popup', '弹出层', '/demo/feedback/popup'],
        ['PullToRefresh', '下拉刷新', '/demo/feedback/pull-to-refresh'],
        ['SwipeAction', '滑动操作', '/demo/feedback/swipe-action'],
        ['Toast', '轻提示', '/demo/feedback/toast'],
      ],
    },
  ] satisfies { header: string; items: [string, string, string][] }[]

  function handleChange(value: string) {
    expanded = expanded !== value ? value : ''
  }

  function onNav(e: Event) {
    const target = e.currentTarget as HTMLElement
    if (!target?.dataset.url) return

    goto(target.dataset.url)
  }

  export const snapshot = {
    capture() {
      return {
        expanded,
        scrollTop: page?.scrollTop,
      }
    },
    async restore(value: any) {
      expanded = value.expanded
      await tick()
      if (page) page.scrollTop = value.scrollTop
    },
  }

  onMount(() => {
    history.scrollRestoration = 'manual'
  })
</script>

{#snippet listItem(text: string, extra: string, url: string)}
  <ListItem clickable={true} onclick={onNav} {extra} data-url={url}>{text}</ListItem>
{/snippet}

<Page class="bg-gray-100" bind:page>
  {#each data as group}
    {@const { header, items } = group}
    <Collapse
      class="m-4"
      {header}
      expanded={expanded === header}
      onChange={() => handleChange(header)}
    >
      {#each items as item}
        {@render listItem(item[0], item[1], item[2])}
      {/each}
    </Collapse>
  {/each}
</Page>
