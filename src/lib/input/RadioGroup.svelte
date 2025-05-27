<script lang="ts" module>
  import './RadioGroup.css'

  import { setContext, untrack } from 'svelte'
  import { generateUUID } from '../common'
  import Space, { type SpaceAttributes } from '../layout/Space.svelte'

  export interface RadioGroupAttributes extends SpaceAttributes {
    /** 选中的选项 */
    value?: PropertyKey
    /** 自定义分组名称 */
    name?: string
    /** 整组失效 */
    disabled?: boolean
    /** 变化时回调函数 */
    onChange?: (value: PropertyKey) => void
  }

  /** 复选框组上下文信息 */
  export interface RadioGroupContext {
    /** 分组名称 */
    name: string
    /** 注册 */
    register: (
      value: PropertyKey,
      input: HTMLInputElement,
      check: (chedked: boolean) => void
    ) => void
    /** 注销 */
    unregister: (value: PropertyKey) => void
    /** 数据变更事件 */
    onChange: () => void
    /** 点击事件 */
    onClick?: (value: unknown) => void
  }
</script>

<script lang="ts">
  let {
    value = $bindable(),
    name = generateUUID(), // TODO UUID
    children,
    onChange: _onChange,
    direction = 'horizontal',
    wrap = false,
    ...props
  }: RadioGroupAttributes = $props()

  let registered = new Map<
    PropertyKey,
    { input: HTMLInputElement; check: (checked: boolean) => void }
  >()

  let context = $state<RadioGroupContext>({
    name,
    register(value, input, check) {
      if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
        console.warn(
          '[RadioGroup]',
          'Radio 提供的 value 不可以是 undefined, null, NaN 或空字符串，将被忽略',
          value
        )
        return
      }

      if (registered.has(value)) {
        console.warn('[RadioGroup]', 'Radio 提供的 value 重复，将被忽略', value)
        return
      }

      registered.set(value, { input, check })
    },
    unregister(value) {
      registered.delete(value)
    },
    onChange() {
      const checked = [...registered.entries()].find(([_, v]) => v.input.checked)
      if (!checked) return

      value = checked[0]

      _onChange?.(value)
    },
  })

  setContext<RadioGroupContext>('sun_parakeet_radio_group', context)

  $effect(() => {
    value

    untrack(() => {
      for (let [k, v] of registered.entries()) {
        const checked = k === value
        v.check(checked)
      }
    })
  })
</script>

<Space class="sunp-checkbox-group" {direction} {wrap} {...props}>
  {@render children?.()}
</Space>
