<script lang="ts">
  import { Page, Stepper, Form, FormItem, Space } from '$lib'

  let form = $state({
    qty: 0,
  })
</script>

<Page class="bg-gray-100">
  <Form layout="horizontal" header="表单-水平布局">
    <FormItem label="基础用法">
      <Stepper />
    </FormItem>
    <FormItem label="步长设置">
      <Stepper step={10} />
    </FormItem>
    <FormItem label="限制输入范围">
      <Stepper
        value={-1}
        min={0}
        max={5}
        onChange={(newVal, oldVal) => console.log('changed', oldVal, '=>', newVal)}
      />
    </FormItem>
    <FormItem label="禁用状态">
      <Stepper disabled />
    </FormItem>
    <FormItem label="只读状态">
      <Stepper readonly />
    </FormItem>
    <FormItem label="禁用输入框">
      <Stepper lockInput />
    </FormItem>
    <FormItem label="固定小数位数">
      <Stepper step={0.1} digits={1} />
    </FormItem>
    <FormItem label="自定义格式">
      <Stepper min={0}>
        {#snippet display(val: number)}
          <Space class="text-sm" block --sp-gap="2px">
            {#if val > 0}
              <span>{val}</span>
              <span>瓶</span>
            {:else}
              <span>N/A</span>
            {/if}
          </Space>
        {/snippet}
      </Stepper>
    </FormItem>
    <FormItem label="圆角风格">
      <Stepper theme="round" />
    </FormItem>
    <FormItem label="0值仅显示'+'">
      <Stepper
        bind:value={form.qty}
        min={0}
        theme="round"
        hideInput={form.qty <= 0}
        hideMinus={form.qty <= 0}
      />
    </FormItem>
  </Form>
  <Form layout="vertical" header="表单-垂直布局">
    <FormItem label="基础用法">
      <Stepper />
    </FormItem>
    <FormItem label="圆角风格">
      <Stepper theme="round" />
    </FormItem>
  </Form>
</Page>
