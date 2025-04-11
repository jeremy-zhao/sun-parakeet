<script lang="ts">
  import { Page, List, Steps, Step, Button, Space, type StepStatus } from '$lib'

  let currentStep = $state(0)
  let status = $state<StepStatus[]>([])

  function handleNext() {
    currentStep = (currentStep + 1) % 4
    if (currentStep === 0) handleReset()
  }

  function handleError() {
    status[currentStep] = 'error'
  }

  function handleSkip() {
    status[currentStep] = 'skip'
    handleNext()
  }

  function handleReset() {
    currentStep = 0
    status = []
  }
</script>

<Page class="bg-gray-100">
  <List header="基础用法">
    <div class="bg-white px-4 py-2">
      <Steps bind:value={currentStep}>
        <Step status={status[0]} header="买家下单" />
        <Step status={status[1]} header="商家接单" />
        <Step status={status[2]} header="骑手取货" />
        <Step status={status[3]} header="骑手送达" />
      </Steps>
    </div>
    <Space class="bg-white px-4 py-2" block>
      <Button onclick={handleNext} disabled={status[currentStep] === 'error'}>下一步</Button>
      <Button onclick={handleError}>错误</Button>
      <Button onclick={handleSkip}>跳过</Button>
      <Button onclick={handleReset}>重置</Button>
    </Space>
  </List>
  <List header="自定义样式">
    <div class="bg-white p-4">
      <Steps bind:value={currentStep}>
        <Step status={status[0]} header="买家下单" icon="consume" />
        <Step
          status={status[1]}
          header="商家接单"
          icon={status => (status !== 'wait' ? 'gift' : undefined)}
        />
        <Step
          status={status[2]}
          header="骑手取货"
          icon={status => (status !== 'wait' ? 'motobike' : undefined)}>取货备注</Step
        >
        <Step
          status={status[3]}
          header="骑手送达"
          icon={status => (status !== 'wait' ? 'check' : undefined)}
        />
      </Steps>
    </div>
  </List>
  <List header="纵向步骤条">
    <div class="bg-white px-4 py-2">
      <Steps bind:value={currentStep} direction="vertical">
        <Step status={status[0]} header="买家下单">
          <p>2025-04-11 12:40</p>
        </Step>
        <Step status={status[1]} header="商家接单">
          <p>2025-04-11 12:45</p>
        </Step>
        <Step status={status[2]} header="骑手取货">
          <p>2025-04-11 12:50</p>
        </Step>
        <Step status={status[3]} header="骑手送达">
          <p>2025-04-11 13:05</p>
        </Step>
      </Steps>
    </div>
  </List>
  <List header="纵向-自定义样式">
    <div class="bg-white px-4 py-2">
      <Steps bind:value={currentStep} direction="vertical">
        <Step status={status[0]} header="买家下单" icon="consume">
          <p>2025-04-11 12:40</p>
        </Step>
        <Step
          status={status[1]}
          header="商家接单"
          icon={status => (status !== 'wait' ? 'gift' : undefined)}
        >
          <p>2025-04-11 12:45</p>
        </Step>
        <Step
          status={status[2]}
          header="骑手取货"
          icon={status => (status !== 'wait' ? 'motobike' : undefined)}
        >
          <p>2025-04-11 12:50</p>
          <p>style="height: 100px"</p>
        </Step>
        <Step
          status={status[3]}
          header="骑手送达"
          icon={status => (status !== 'wait' ? 'check' : undefined)}
        >
          <p>2025-04-11 13:05</p>
        </Step>
      </Steps>
    </div>
  </List>
</Page>
