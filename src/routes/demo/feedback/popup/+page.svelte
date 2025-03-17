<script lang="ts" module>
  import { Page, List, Popup, Button } from '$lib'
</script>

<script lang="ts">
  let popups = $state({
    center: false,
    top: false,
    right: false,
    bottom: false,
    left: false,
  })
</script>

<Page class="bg-gray-100">
  <List header="基本用法">
    <div class="bg-white p-4">
      <Button class="border" onclick={() => (popups.center = true)}>中</Button>
      <Button class="border" onclick={() => (popups.top = true)}>上</Button>
      <Button class="border" onclick={() => (popups.right = true)}>右</Button>
      <Button class="border" onclick={() => (popups.bottom = true)}>下</Button>
      <Button class="border" onclick={() => (popups.left = true)}>左</Button>
    </div>
  </List>
</Page>

<Popup bind:visible={popups.center} position="center" onclose={() => (popups.center = false)}>
  <span>center</span>
</Popup>

<Popup bind:visible={popups.top} position="top" onclose={() => (popups.top = false)}>
  <span>top</span>
</Popup>

<Popup bind:visible={popups.right} position="right" onclose={() => (popups.right = false)}>
  <span>right</span>
</Popup>

<Popup bind:visible={popups.bottom} position="bottom" onclose={() => (popups.bottom = false)}>
  <span>bottom</span>
</Popup>

<Popup bind:visible={popups.left} position="left" onclose={() => (popups.left = false)}>
  <span>left</span>
</Popup>
