<script lang="ts">
  import VConsole from 'vconsole'
  import { Page } from '$lib'
  import { onMount } from 'svelte'

  onMount(() => {
    new VConsole()
  })
</script>

<svelte:head>
  <title>控制台</title>
</svelte:head>

<Page>
  <p>控制台已打开</p>
  <p>注：本页面用于手机端调试，非 sun-parakeet 组件</p>
</Page>
