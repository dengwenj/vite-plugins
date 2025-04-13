const rollup = require('rollup')
const path = require('path')
const typescript = require('@rollup/plugin-typescript')
const nodeResolve = require('@rollup/plugin-node-resolve')
const { dts } = require('rollup-plugin-dts')
const pc = require('picocolors')

const args = process.argv.slice(2)
const plugin = args[args.length - 1]

const finallyPath = (url) => {
  return path.resolve(__dirname, url)
}

const horizontalBarToHump = (data) => {
  let hump = ""
  data.split('-').forEach((item, index) => {
    if (index > 0) {
      const str = item.charAt(0).toUpperCase() + item.slice(1)
      hump += str
    } else {
      hump += item
    }
  })
  return hump
}

let startTime = new Date()
let endTime
/**
 * rollup 通过 JS API 的方式进行打包
 */
async function build() {
  // 入口文件路径
  const input = finallyPath(`./packages/${plugin}/index.ts`)

  // 创建一个 Rollup 打包配置
  const bundle = await rollup.rollup({
    input,
    plugins: [
      nodeResolve({
        extensions: ['.ts', '.js', '.json']
      }),
      typescript({
        tsconfig: finallyPath(`./packages/${plugin}/tsconfig.json`)
      }),
    ]
  })

  // 生成输出文件 es
  await bundle.write({
    file: finallyPath(`./packages/${plugin}/dist/bundle.es.js`),
    format: 'es'
  })
  // iife
  await bundle.write({
    file: finallyPath(`./packages/${plugin}/dist/bundle.iife.js`), // 输出文件路径
    format: 'iife',
    name: horizontalBarToHump(plugin)
  })
  // cjs
  await bundle.write({
    file: finallyPath(`./packages/${plugin}/dist/bundle.cjs.js`),
    format: 'cjs'
  })

  // 生成类型文件
  const dtsBundle = await rollup.rollup({
    input,
    plugins: [dts()],
  })
  await dtsBundle.write({
    file: finallyPath(`./packages/${plugin}/dist/index.d.ts`),
    format: 'esm',
  })

  endTime = new Date()

  // 关闭打包实例
  await bundle.close()
}

// 调用构建函数
build()
  .then(() => {
    console.log(pc.green(`打包成功, 共花费${((endTime - startTime) / 1000).toFixed(2)}s`))
  })
  .catch((error) => {
    console.error(pc.bgRed('打包过程中出现错误: '), error)
})
