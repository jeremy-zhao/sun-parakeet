<script lang="ts" module>
  import { Page, Collapse } from '$lib'
</script>

<script lang="ts">
  let expanded = $state(-1)
</script>

<Page>
  <h2 class="px-4">基础用法</h2>
  <Collapse header="折叠面板">
    {#each new Array(20) as row, ix}
      <p>第{ix}行</p>
    {/each}
  </Collapse>
  <Collapse header="折叠面板">
    <p>第一行</p>
    <p>第二行</p>
  </Collapse>
  <br />
  <h2 class="px-4">手风琴 {expanded}</h2>
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
</Page>
