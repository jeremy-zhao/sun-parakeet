<script lang="ts">
  import { Page, IndexBar, List, ListItem } from '$lib'
  import _province from '@province-city-china/province'
  import _city from '@province-city-china/city'

  const provinceAbbrByCode = {
    '11': '京', // 北京市
    '12': '津', // 天津市
    '13': '冀', // 河北省
    '14': '晋', // 山西省
    '15': '蒙', // 内蒙古自治区
    '21': '辽', // 辽宁省
    '22': '吉', // 吉林省
    '23': '黑', // 黑龙江省
    '31': '沪', // 上海市
    '32': '苏', // 江苏省
    '33': '浙', // 浙江省
    '34': '皖', // 安徽省
    '35': '闽', // 福建省
    '36': '赣', // 江西省
    '37': '鲁', // 山东省
    '41': '豫', // 河南省
    '42': '鄂', // 湖北省
    '43': '湘', // 湖南省
    '44': '粤', // 广东省
    '45': '桂', // 广西壮族自治区
    '46': '琼', // 海南省
    '50': '渝', // 重庆市
    '51': '川', // 四川省
    '52': '贵', // 贵州省
    '53': '云', // 云南省
    '54': '藏', // 西藏自治区
    '61': '陕', // 陕西省
    '62': '甘', // 甘肃省
    '63': '青', // 青海省
    '64': '宁', // 宁夏回族自治区
    '65': '新', // 新疆维吾尔自治区
    '81': '港', // 香港特别行政区
    '82': '澳', // 澳门特别行政区
    '71': '台', // 台湾省（实际使用需注意合规性）
  } as Record<string, string>
</script>

<Page class="overflow-hidden bg-gray-100">
  <IndexBar>
    {#each _province as province}
      <List header={province.name} data-index={provinceAbbrByCode[province.province]}>
        {@const cities = _city.filter(x => x.province === province.province)}
        {#if cities.length}
          {#each _city.filter(x => x.province === province.province) as city}
            <ListItem icon="none" clickable>{city.name}</ListItem>
          {/each}
        {:else}
          <ListItem icon="none" clickable>{province.name}</ListItem>
        {/if}
      </List>
    {/each}
  </IndexBar>
</Page>
