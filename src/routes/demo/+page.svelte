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
    <p class="text-gray-600">
      Enim proident nulla voluptate non. Pariatur dolor amet tempor esse cupidatat exercitation eu laboris id nostrud ut
      aliquip non labore excepteur. Ex ad irure reprehenderit ea nisi tempor qui aliquip ut mollit. Ad eiusmod labore ex
      sit. Lorem nisi laborum deserunt aliqua veniam incididunt. Incididunt excepteur ipsum consequat aliquip anim
      consequat.
    </p>
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
