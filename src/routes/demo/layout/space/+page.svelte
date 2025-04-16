<script lang="ts" module>
  import { Page, List, Space, Button } from '$lib'
</script>

<script lang="ts">
</script>

<Page class="bg-gray-100">
  <List header="水平方向的间距">
    <div class="bg-white px-4 py-2">
      <Space>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    </div>
  </List>
  <List header="换行">
    <div class="bg-white px-4 py-2">
      <Space wrap>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
        <Button>按钮4</Button>
        <Button>按钮5</Button>
        <Button>按钮6</Button>
        <Button>按钮7</Button>
        <Button>按钮8</Button>
        <Button>按钮9</Button>
        <Button>按钮10</Button>
        <Button>按钮11</Button>
      </Space>
    </div>
  </List>
  <List header="垂直方向的间距">
    <div class="bg-white px-4 py-2">
      <Space direction="vertical">
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    </div>
  </List>
  <List header="渲染为块级元素">
    <div class="bg-white px-4 py-2">
      <Space direction="vertical" block>
        <Button>按钮1</Button>
        <Button>按钮2</Button>
        <Button>按钮3</Button>
      </Space>
    </div>
  </List>
  <List header="主轴对齐方式">
    <div class="bg-white px-4 py-2">
      <Space class="justify-center" block>
        <Button --sunp-height="auto" --sunp-padding-y="4px">1</Button>
        <Button --sunp-height="auto" --sunp-padding-y="4px">
          2<br />2
        </Button>
        <Button --sunp-height="auto" --sunp-padding-y="4px">
          3<br />3<br />3
        </Button>
      </Space>
    </div>
  </List>
  <List header="交叉轴对齐方式">
    <div class="bg-white px-4 py-2">
      <Space class="items-end">
        <Button --sunp-height="auto" --sunp-padding-y="4px">1</Button>
        <Button --sunp-height="auto" --sunp-padding-y="4px">
          2<br />2
        </Button>
        <Button --sunp-height="auto" --sunp-padding-y="4px">
          3<br />3<br />3
        </Button>
      </Space>
    </div>
  </List>
</Page>
