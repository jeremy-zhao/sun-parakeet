<script lang="ts" module>
  import _province from '@province-city-china/province'
  import _city from '@province-city-china/city'
  import _area from '@province-city-china/area'
  import { Page, List, PickerView, showToast, delay } from '$lib'
</script>

<script lang="ts">
  import Button from '$lib/common/Button.svelte'

  const province = _province
    .map(x => ({ value: x.province, label: x.name }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  const city = _city
    .map(x => ({ value: `${x.province}${x.city}`, label: x.name, province: x.province }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  const area = _area
    .map(x => ({ value: `${x.province}${x.city}${x.area}`, label: x.name, city: `${x.province}${x.city}` }))
    .sort((a, b) => (a.value < b.value ? -1 : 1))

  let baseValue = $state<unknown[]>(['周一', '晚上'])
  let cascadeValue = $state<unknown[]>([])

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
  <List header="基础用法 {baseValue}">
    <PickerView bind:value={baseValue} columns={2} loader={baseLoader} {onChange} />
    <div class="px-4 py-2">
      <Button onclick={() => (baseValue = ['周四', '下午'])}>周四,下午</Button>
      <Button onclick={() => (baseValue = [])}>清除</Button>
    </div>
  </List>
  <List header="联动">
    <PickerView bind:value={cascadeValue} columns={3} loader={cascadeLoader} {onChange} />
  </List>
  <List header="异步加载">
    <PickerView bind:value={cascadeValue} columns={3} loader={cascadeLoaderAsync} {onChange} />
  </List>

  <p class="px-4 py-2">PC 端暂时不支持鼠标拖拽改变数值</p>
</Page>
