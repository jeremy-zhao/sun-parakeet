<script lang="ts" module>
  import { Page, List, Badge } from '$lib'
</script>

<script lang="ts">
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white p-4">
      <Badge content={5} class="mr-4">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content={99} class="mr-4">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content={100} class="mr-4" border>
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content="新" class="mr-4">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content class="mr-4">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
    </div>
  </List>
  <List header="带边框">
    <div class="bg-white p-4">
      <Badge content="更新啦" border>
        <div class="h-10 w-10 rounded-md bg-gray-400"></div>
      </Badge>
    </div>
  </List>
  <List header="独立使用">
    <div class="bg-white p-4">
      <Badge content="更新啦"></Badge>
      <Badge content="新消息！" />
    </div>
  </List>
  <List header="自定义颜色和偏移量">
    <div class="bg-white p-4">
      <Badge content class="mr-4" --sp-color="blue" --sp-right="100%" --sp-top="100%">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content class="mr-4" --sp-color="green" --sp-right="100%">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content class="mr-4" --sp-color="orange">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content class="mr-4" --sp-color="purple" --sp-top="100%">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
      <Badge content class="mr-4" --sp-top="50%">
        <div class="h-10 w-10 rounded-md bg-gray-300"></div>
      </Badge>
    </div>
  </List>
</Page>
