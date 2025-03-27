<script lang="ts" module>
  import _province from '@province-city-china/province'
  import _city from '@province-city-china/city'
  import _area from '@province-city-china/area'
  import { Page, Button, List, Input, Picker, Form, FormItem, showToast, delay } from '$lib'
</script>

<script lang="ts">
  const province = _province
    .map(x => ({ value: x.province, label: x.name }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  const city = _city
    .map(x => ({ value: `${x.province}${x.city}`, label: x.name, province: x.province }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  const area = _area
    .map(x => ({ value: `${x.province}${x.city}${x.area}`, label: x.name, city: `${x.province}${x.city}` }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  let baseLoaderVisible = $state(false)
  let cascadeLoaderVisible = $state(false)
  let cascadeLoaderAsyncVisible = $state(false)

  let form = $state({
    location: ['65', '6527', '652702'],
    // location: [],
  })

  function baseLoader(value: string[]) {
    if (!value?.length) {
      return ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    } else {
      return ['上午', '下午']
    }
  }

  function cascadeLoader(value: string[]) {
    if (!value?.length) {
      return province
    } else if (value.length == 1) {
      const re = city.filter(x => x.province === value[0])
      if (re.length) return re

      const pr = province.find(x => x.value === value[0])
      if (!pr) return re

      re.push({ value: `${pr.value}01`, label: pr.label, province: pr.value })
      return re
    } else {
      return area.filter(x => x.city === value[1])
    }
  }

  async function cascadeLoaderAsync(value: string[]) {
    await delay(500)

    if (!value?.length) {
      return province
    } else if (value.length == 1) {
      const re = city.filter(x => x.province === value[0])
      if (re.length) return re

      const pr = province.find(x => x.value === value[0])
      if (!pr) return re

      re.push({ value: `${pr.value}01`, label: pr.label, province: pr.value })
      return re
    } else {
      return area.filter(x => x.city === value[1])
    }
  }

  function onChange(value: unknown[]) {
    showToast({ text: value.join(',') })
  }
</script>

<Page class="bg-gray-100">
  <!-- <List header="基础用法">
    <div class="bg-white p-4">
      <Button onclick={() => (baseLoaderVisible = true)}>选择</Button>
      <Picker header="请选择" bind:visible={baseLoaderVisible} columns={2} loader={baseLoader} {onChange} />
    </div>
  </List>
  <List header="联动">
    <div class="bg-white p-4">
      <Button onclick={() => (cascadeLoaderVisible = true)}>选择</Button>
      <Picker header="请选择" bind:visible={cascadeLoaderVisible} columns={3} loader={cascadeLoader} {onChange} />
    </div>
  </List>
  <List header="异步加载">
    <div class="bg-white p-4">
      <Button onclick={() => (cascadeLoaderAsyncVisible = true)}>选择</Button>
      <Picker
        header="请选择"
        bind:visible={cascadeLoaderAsyncVisible}
        columns={3}
        loader={cascadeLoaderAsync}
        {onChange}
      />
    </div>
  </List> -->
  <Form header="配合表单使用-水平布局" layout="horizontal">
    <FormItem label="地区编码" rules={[{ required: true }]}>
      <Input bind:value={form.location} />
    </FormItem>
    <FormItem label="地区" rules={[{ required: true }]}>
      <Picker
        bind:value={form.location}
        header="请选择"
        placeholder="省/市/区"
        columns={3}
        loader={cascadeLoader}
        clearable
      />
    </FormItem>
  </Form>
  <Form header="配合表单使用-垂直布局" layout="vertical">
    <FormItem label="地区" rules={[{ required: true }]}>
      <Picker
        bind:value={form.location}
        header="请选择"
        placeholder="省/市/区"
        columns={3}
        loader={cascadeLoader}
        clearable
      />
    </FormItem>
  </Form>
  <p class="px-4 py-2">PC 端暂时不支持鼠标拖拽改变数值</p>
  <p class="px-4 py-2">双重绑定，联动显示有 Bug</p>
  <p class="px-4 py-2">清除后直接确认第一个，有 Bug</p>
</Page>
