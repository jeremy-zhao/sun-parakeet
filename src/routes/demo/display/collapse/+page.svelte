<script lang="ts" module>
  import { Page, List, Collapse } from '$lib'
</script>

<script lang="ts">
  let expanded = $state(-1)
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <Collapse header="基础用法">
      <p class="text-gray-600">
        Adipisicing labore cupidatat aute commodo irure irure. Anim laboris cupidatat proident ullamco cupidatat commodo
        do voluptate commodo pariatur ullamco. Velit eu ipsum eu dolore nostrud reprehenderit minim ex ex duis nisi
        officia ullamco. Ipsum veniam sunt magna ea ad culpa laborum duis sit elit magna pariatur. Adipisicing eu
        aliquip elit aliquip qui et. Voluptate cupidatat adipisicing eu voluptate magna exercitation excepteur voluptate
        aliqua esse aute dolore. Ut enim nisi minim esse qui ad tempor sit laborum labore enim amet dolore eiusmod
        occaecat.
      </p>
    </Collapse>
    <Collapse header="默认展开" expanded={true}>
      <p class="text-gray-600">
        Fugiat commodo est ad sint est culpa sunt voluptate enim et proident et non. Consequat irure laborum culpa. Ad
        dolore sit anim. Irure in proident in nulla esse excepteur proident excepteur aute duis nostrud voluptate
        excepteur aliquip. Officia quis excepteur commodo velit reprehenderit ipsum dolore do. Ut consectetur et sit
        culpa do culpa enim nisi do in incididunt. Nulla nisi dolor est minim labore velit tempor Lorem ad ipsum ullamco
        anim Lorem velit est. Laboris enim consectetur do reprehenderit reprehenderit sit sunt eu duis ipsum.
      </p>
    </Collapse>
    <Collapse header="内部滚动" --sp-padding="0">
      <div class="overflow-y-auto py-4" style="height: 200px">
        {#each new Array(20) as row, ix}
          <p>第{ix}行</p>
        {/each}
      </div>
    </Collapse>
  </List>
  <List header="手风琴 {expanded}">
    <Collapse expanded={expanded === 0} header="折叠面板" onChange={ex => (expanded = ex ? 0 : -1)}>
      <p>第一行</p>
      <p>第二行</p>
    </Collapse>
    <Collapse expanded={expanded === 1} header="折叠面板" onChange={ex => (expanded = ex ? 1 : -1)}>
      <p>第一行</p>
      <p>第二行</p>
    </Collapse>
    <Collapse expanded={expanded === 2} header="折叠面板" onChange={ex => (expanded = ex ? 2 : -1)}>
      <p>第一行</p>
      <p>第二行</p>
    </Collapse>
  </List>
  <p class="bg-white p-4">因为 List 和 ListItem 修改过了，导致这里会有Bug，需要修改</p>
  <p class="bg-white p-4">Collapse 的内容可能是 List，这里要考虑如何兼容</p>
</Page>
