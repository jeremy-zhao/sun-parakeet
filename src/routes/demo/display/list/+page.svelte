<script lang="ts" module>
  import { Page, Icon, List, ListItem } from '$lib'
</script>

<script lang="ts">
  let clickable = $state(true)
</script>

<Page class="bg-gray-100">
  <List>
    <ListItem>
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
    <ListItem header="条目标题" icon="arrow-down-s-line">
      <span>列表条目</span>
    </ListItem>
    <ListItem description="这是一段很长的说明有可能会超过原有的长度或者造成换行">
      {#snippet aside()}
        <div class="h-8 w-8 rounded-full bg-red-600"></div>
      {/snippet}
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
  </List>
  <List header="列表标题">
    <ListItem {clickable}>
      {#snippet aside()}
        <div class="h-8 w-8 rounded-full bg-red-600"></div>
      {/snippet}
      <span>列表条目</span>
    </ListItem>
    <ListItem {clickable} header="条目标题">
      {#snippet aside()}
        <div class="h-8 w-8 rounded-full bg-red-600"></div>
      {/snippet}
      <span>列表条目</span>
    </ListItem>
    <ListItem {clickable} description="这是一段很长的说明有可能会超过原有的长度或者造成换行">
      {#snippet aside()}
        <div class="h-8 w-8 rounded-full bg-red-600"></div>
      {/snippet}
      <span>列表条目</span>
      {#snippet extra()}
        <span>条目的值</span>
      {/snippet}
    </ListItem>
  </List>
</Page>
