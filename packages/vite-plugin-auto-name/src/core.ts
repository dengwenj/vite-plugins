import { Plugin } from 'vite'

const VUE = 'vue'
const SETUP = 'setup'
const NAME = 'name'
const LANG = 'lang'

/**
 * vue 组件中使用 <script setup> 写法时，自动注入 name
 * @param path 从哪个路径下面开始检查
 */
function autoName(path?: string): Plugin {
  if (!path) {
    path = '/src'
  }
  return {
    name: 'auto-name',
    transform(code, id) {
      let source = code
      if (isInject(id, path)) {
        source = parse(code)
      }
      return source
    },
  }
}

const isInject = (id: string, path: string) => {
  const arr = id.split('.')
  const suffix = arr[arr.length - 1]
  if (id.includes(path) && suffix === VUE) {
    return true
  }
  return false
}

const getEndIndex = (code: string, startIndex: number) => {
  let count = 1
  let endIndex = -1
  for (let i = startIndex + 1; i < code.length; i++) {
    const char = code[i]
    if (char === '<') {
      count++
    }
    if (char === '>') {
      count--
    }
    if (count === 0) {
      endIndex = i
      break
    }
  }
  return endIndex
}

const parse = (code: string) => {
  const startIndex = code.indexOf('<script')
  if (startIndex === -1) {
    return code
  }

  const endIndex = getEndIndex(code, startIndex)
  if (endIndex === -1) {
    return code
  }
  
  // <script setup lang="ts" name="jj">
  const res = code.slice(startIndex, endIndex)

  // setup 和 name 必须要有
  if (!res.includes(SETUP) || !res.includes(NAME)) {
    return code
  }

  // 空格进行分割
  const data = res.split(' ')
  let nameIndex = -1
  let langIndex = -1

  for (let i = 0; i < data.length; i++) {
    if (data[i].includes(NAME)) {
      nameIndex = i
    } else if (data[i].includes(LANG)) {
      langIndex = i
    }
  }
  
  let lang = ""
  if (langIndex !== -1) {
    lang = data[langIndex]
  }

  let name
  if (nameIndex !== -1) {
    const [_, n] = data[nameIndex].split('=')
    name = n
  }

  // 转换为新的资源
  let source = `
<script ${lang}>
export default {
  ${NAME}: ${name}
}
</script>
${code}
`

  return source
}

export default autoName
