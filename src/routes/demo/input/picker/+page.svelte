<script lang="ts" module>
  import _province from '@province-city-china/province'
  import _city from '@province-city-china/city'
  import _area from '@province-city-china/area'
  import { Page, Button, List, Input, Picker, Form, FormItem, Divider, showToast, delay } from '$lib'
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
  <List header="基础用法">
    <div class="bg-white p-4">
      <Button onclick={() => (baseLoaderVisible = true)}>选择</Button>
      <Picker header="请选择" bind:visible={baseLoaderVisible} columns={2} loader={baseLoader} {onChange} />
    </div>
  </List>
  <Form header="配合表单使用-水平布局-联动" layout="horizontal">
    <FormItem label="地区编码">
      <span>{form.location}</span>
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
  <Form header="配合表单使用-垂直布局-异步加载-自定义显示" layout="vertical">
    <FormItem label="地区" rules={[{ required: true }]}>
      <Picker
        bind:value={form.location}
        placeholder="省/市/区"
        header="请选择"
        columns={3}
        loader={cascadeLoaderAsync}
        clearable
      >
        {#snippet display(texts)}
          {#if texts.length}
            <p>
              {#each texts as text, index}
                <span></span>
                <span>{text}</span>
                {#if index < texts.length - 1}
                  <Divider direction="vertical" --sp-margin="8px" />
                {/if}
              {/each}
            </p>
          {:else}
            <p class="text-gray-400">
              <span>省</span>
              <Divider direction="vertical" --sp-margin="8px" />
              <span>市</span>
              <Divider direction="vertical" --sp-margin="8px" />
              <span>区</span>
            </p>
          {/if}
        {/snippet}
      </Picker>
    </FormItem>
    <div class="px-4 py-2">
      <Button
        onclick={() => {
          form.location = ['31', '3101', '310101']
        }}>上海市黄浦区</Button
      >
      <Button
        onclick={() => {
          form.location = ['32', '3210', '321002']
        }}>扬州市广陵区</Button
      >
      <Button
        onclick={() => {
          form.location = []
        }}>重置</Button
      >
    </div>
  </Form>

  <p class="px-4 py-2">PC 端暂时不支持鼠标拖拽改变数值</p>
  <p class="px-4 py-2">Bug 先在组件中点清除，然后再点重置按钮，“必填”仍然存在</p>
  <p class="px-4 py-2">Bug makeDisplay 异步过程可能存在需要 Cancel 的情况</p>
</Page>
