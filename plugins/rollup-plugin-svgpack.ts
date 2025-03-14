import * as R from 'ramda'
import path from 'path'
import fs from 'fs-extra'
import { optimize } from 'svgo'
import svgstore from 'svgstore'

// const svgoConfig: Config = {
//   plugins: [{ name: 'preset-default', params: { overrides: { removeUselessStrokeAndFill: false } } }],
// }

interface SvgPackOption {
  /** 文件夹 */
  from: string | string[]
  /** 目标文件 */
  to: string
}

export default function svgpack(
  options: SvgPackOption[] = [{ from: 'src/lib/symbol', to: 'static/icons/symbol.svg' }]
) {
  const cwd = process.cwd()

  const ops = R.pipe(
    R.map((op: SvgPackOption) => {
      const { from, to } = op
      const toA = path.join(cwd, to)

      if (Array.isArray(from)) {
        return from.map(x => ({ from: path.join(cwd, x), to: toA }))
      } else {
        return [{ from: path.join(cwd, from), to: toA }]
      }
    }),
    R.flatten
  )(options)

  const frMap = R.groupBy((x: SvgPackOption) => x.from as string)(ops)
  const toMap = R.groupBy((x: SvgPackOption) => x.to)(ops)

  const froms = Object.keys(frMap)
  const tos = Object.keys(toMap)

  // 判断文件是否命中
  function hit(file: string) {
    if (path.extname(file).toLowerCase() !== '.svg') return false

    const filename = path.resolve(file)

    for (const from of froms) {
      if (filename.startsWith(from)) return true
    }

    return false
  }

  async function make() {
    const targetMap = new Map(tos.map(x => [x, svgstore({ cleanDefs: true })]))

    for (const { from, to } of ops) {
      if (!(await fs.pathExists(from))) continue

      const svgs = await fs.readdir(from)

      let target

      if (targetMap.has(to)) {
        target = targetMap.get(to)
      } else {
        target = svgstore({ cleanDefs: true })
        targetMap.set(to, target)
      }

      for (const svg of svgs) {
        const filename = path.join(from, svg)
        if (path.extname(filename) !== '.svg') continue

        const code = await fs.readFile(filename, { encoding: 'utf8' })

        // 使用 SVGO 进行优化
        const result = optimize(code)

        // 删除 result 中的 p-id class 等属性
        result.data = result.data.replace(/p-id=".*?"/g, '').replace(/class=".*?"/g, '')

        // 如果 result 中有 fill 属性，属性值不为 none/currentColor, 则移除 fill
        result.data = result.data.replace(/fill="[^(none|currentColor)].*?"/g, '')

        // 如果 result 中有 stroke 属性，属性值不为 none, 则移除 stroke
        result.data = result.data.replace(/stroke="[^(none|currentColor)].*?"/g, '')

        // 将优化后的 svg 添加到 sprites 中
        target.add(svg.replace('.svg', ''), result.data, { copyAttrs: ['fill', 'stroke'] })
      }
    }

    for (const [filename, target] of targetMap) {
      // 删除 sprites 的 <?xml...?> 标签和 <!DOCTYPE...> 标签 和 <defs/> 标签
      // Delete the <?xml...?> tag and <!DOCTYPE...> tag of sprites
      const code = target
        .toString()
        .replace(/<\?xml[^>]*>/g, '')
        .replace(/<!DOCTYPE[^>]*>/g, '')
        .replace(/<defs\/>/g, '')

      const dir = path.dirname(filename)

      if (!(await fs.pathExists(dir))) {
        await fs.mkdir(dir)
      }

      // 写入到指定的文件中
      // Write to the specified file
      await fs.writeFile(filename, code)
    }
  }

  return {
    name: 'rollup-plugin-svgpack',

    buildStart() {
      make()
    },

    watchChange(id: string) {
      if (!hit(id)) return
      console.log('change', id)
      make()
    },
  }
}
