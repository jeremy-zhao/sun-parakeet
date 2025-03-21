<script lang="ts" module>
  import { Page, List, Button, ActionSheet, showToast } from '$lib'
</script>

<script lang="ts">
  let visible = $state([false, false])

  function onAction(action: string, index: number) {
    showToast({ text: action })
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => (visible[0] = true)}>最简单的用法</Button>
      <Button class="border" onclick={() => (visible[1] = true)}>标题与取消按钮</Button>
    </div>
  </List>

  <p>这里有bug，连续点“动作1”和“动作2”时，有可能 Toast 瞬间消失</p>
</Page>

<ActionSheet bind:visible={visible[0]} actions={['动作1', '动作2']} {onAction} />

<ActionSheet bind:visible={visible[1]} header="动作面板" actions={['动作1', '动作2']} cancel="取消" {onAction} />
