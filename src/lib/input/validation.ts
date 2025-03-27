/** 校验规则 */
export interface Rule {
  /** 错误信息，不设置时会通过模板自动生成 */
  message?: string
  /** 是否为必填字段 */
  required?: boolean
  /**  */
  validator?: (rule: Rule, value: unknown) => string
}

function requiredValidation(rule: Rule, value: unknown) {
  if (!rule?.required) return

  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return rule.message || '必填'
  } else if (typeof value === 'number' && isNaN(value)) {
    return rule.message || '请输入有效数字'
  } else if (Array.isArray(value) && value.length === 0) {
    return rule.message || '必填'
  }
}

function validatorValidation(rule: Rule, value: unknown) {
  if (typeof rule?.validator !== 'function') return
  return rule.validator(rule, value)
}

const validationPipeline = [requiredValidation, validatorValidation]

/** 校验所有的规则 */
export function validate(rules: Rule[], value: unknown) {
  for (let rule of rules) {
    if (!rule) return

    for (let validator of validationPipeline) {
      const err = validator(rule, value)
      if (err) return err
    }
  }
}
