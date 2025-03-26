<script lang="ts" module>
  import _province from '@province-city-china/province'
  import _city from '@province-city-china/city'
  import _area from '@province-city-china/area'
  import { Page, List, PickerView, showToast } from '$lib'
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

  function onChange(value: unknown[]) {
    showToast({ text: value.join(',') })
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <PickerView columns={2} loader={baseLoader} {onChange} />
  </List>
  <List header="联动">
    <PickerView columns={3} loader={cascadeLoader} {onChange} />
  </List>
  <p>PC 端暂时不支持鼠标拖拽改变数值</p>
</Page>
