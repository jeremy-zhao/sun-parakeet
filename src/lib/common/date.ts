/** 日期精度 */
export type DatePrecision = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'

/** 判定给定的值是否为有效的 Date 类型 */
export function isValid(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

/** 返回根据精度截断后的日期 */
export function normalize(precision: DatePrecision, date: Date) {
  const re = new Date(date)
  if (!isValid(date)) throw re

  switch (precision) {
    case 'year':
      re.setMonth(0)
    case 'month':
      re.setDate(1)
    case 'day':
      re.setHours(0)
    case 'hour':
      re.setMinutes(0)
    case 'minute':
      re.setSeconds(0)
    case 'second':
      re.setMilliseconds(0)
      break
    default:
      throw new Error(`Invalid precision: ${precision}`)
  }

  return re
}

/** 返回根据指定的精度标准化后 date2.getTime() - date1.getTime() 的数值 */
export function diff(precision: DatePrecision, date1: Date, date2: Date): number {
  if (!isValid(date1)) throw new Error('Invalid date1')
  if (!isValid(date2)) throw new Error('Invalid date2')

  const dateA = normalize(precision, date1)
  const dateB = normalize(precision, date2)

  return dateB.getTime() - dateA.getTime()
}

/** 判断两个日期在指定精度下是否相等 */
export function isSame(precision: DatePrecision, date1: Date, date2: Date): boolean {
  const delta = diff(precision, date1, date2)
  return delta === 0
}

/** 判断当前的值是否改变 */
export function hasChanged(current: unknown, newValue: Date | null | undefined) {
  if (newValue && !isValid(newValue)) throw new Error('Invalid new date')

  if (current == null && newValue == null) return false
  if (current == null || newValue == null || !isValid(current)) return true

  return current.getTime() !== newValue.getTime()
}

export function toString(precision: DatePrecision, date: Date) {
  const re = []

  re.push(date.getFullYear().toString())
  if (precision === 'year') return re.join('')

  re.push('-')
  re.push((date.getMonth() + 1).toString().padStart(2, '0'))
  if (precision === 'month') return re.join('')

  re.push('-')
  re.push(date.getDate().toString().padStart(2, '0'))
  if (precision === 'day') return re.join('')

  re.push(' ')
  re.push(date.getHours().toString().padStart(2, '0'))
  if (precision === 'hour') return re.join('')

  re.push(':')
  re.push(date.getMinutes().toString().padStart(2, '0'))
  if (precision === 'minute') return re.join('')

  re.push(' ')
  re.push(date.getSeconds().toString().padStart(2, '0'))
  return re.join('')
}

export default { isValid, normalize, diff, isSame, hasChanged, toString }
