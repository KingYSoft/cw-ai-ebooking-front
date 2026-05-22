import { useDisplay } from 'vuetify'

export function useLayoutCols() {
  const display = useDisplay()

  const row1Cols = () => {
    const { lg, md, sm, xl, xxl } = display
    if (lg.value || xl.value || xxl.value) {
      return 12 / 1
    } else if (md.value) {
      return 12
    } else if (sm.value) {
      return 12
    } else {
      return 12
    }
  }

  const row2Cols = () => {
    const { lg, md, sm, xl, xxl } = display
    if (lg.value || xl.value || xxl.value) {
      return 12 / 2
    } else if (md.value) {
      return 12 / 2
    } else if (sm.value) {
      return 12
    } else {
      return 12
    }
  }

  const row3Cols = () => {
    const { lg, md, sm, xl, xxl } = display
    if (lg.value || xl.value || xxl.value) {
      return 12 / 3
    } else if (md.value) {
      return 12 / 2
    } else if (sm.value) {
      return 12
    } else {
      return 12
    }
  }

  const row4Cols = () => {
    const { lg, md, sm, xl, xxl } = display
    if (lg.value || xl.value || xxl.value) {
      return 12 / 4
    } else if (md.value) {
      return 12 / 3
    } else if (sm.value) {
      return 12 / 2
    } else {
      return 12
    }
  }

  const row6Cols = () => {
    const { lg, md, sm, xl, xxl } = display
    if (lg.value || xl.value || xxl.value) {
      return 12 / 6
    } else if (md.value) {
      return 12 / 4
    } else if (sm.value) {
      return 12 / 2
    } else {
      return 12
    }
  }

  // 通用响应式列宽计算方法
  const rescols = pattern => {
    const { lg, md, sm, xl, xxl } = display

    // 解析模式字符串
    // 模式格式1: c{value} - 所有屏幕尺寸都返回value
    // 模式格式2: c{value}[l{value}][m{value}][s{value}][x{value}][xx{value}] - 针对不同屏幕尺寸返回不同值
    // c是默认值，l/m/s/x/xx是针对特定屏幕尺寸的覆盖值，可以任意顺序出现
    // 对于当前屏幕尺寸，从当前尺寸开始向更小的屏幕尺寸查找，如果找到了就使用该值，否则使用c的值
    const simpleRegex = /^c(\d+)$/
    const complexRegex = /^c(\d+)(?:[lmsx]\d+|xx\d+)*$/

    // 处理简单模式 c{value}
    const simpleMatch = pattern.match(simpleRegex)
    if (simpleMatch) {
      return Number.parseInt(simpleMatch[1])
    }

    // 处理复杂模式
    const complexMatch = pattern.match(complexRegex)
    if (!complexMatch) {
      return 12
    }

    // 提取默认值和各屏幕尺寸的值
    const defaultValue = Number.parseInt(complexMatch[1])

    // 使用单独的正则表达式提取各屏幕尺寸的值
    const lgMatch = pattern.match(/l(\d+)/)
    const mdMatch = pattern.match(/m(\d+)/)
    const smMatch = pattern.match(/s(\d+)/)
    const xlMatch = pattern.match(/x(\d+)/)
    const xxlMatch = pattern.match(/xx(\d+)/)

    const values = {
      lg: lgMatch ? Number.parseInt(lgMatch[1]) : null,
      md: mdMatch ? Number.parseInt(mdMatch[1]) : null,
      sm: smMatch ? Number.parseInt(smMatch[1]) : null,
      xl: xlMatch ? Number.parseInt(xlMatch[1]) : null,
      xxl: xxlMatch ? Number.parseInt(xxlMatch[1]) : null,
    }

    // 屏幕尺寸顺序：sm -> md -> lg -> xl -> xxl
    const screenSizeOrder = ['sm', 'md', 'lg', 'xl', 'xxl']
    const displayValues = { sm, md, lg, xl, xxl }

    // 找到当前激活的屏幕尺寸
    let currentSize = null
    for (const size of screenSizeOrder) {
      if (displayValues[size].value) {
        currentSize = size
        break
      }
    }

    // 如果没有找到激活的屏幕尺寸，使用默认值
    if (!currentSize) {
      return defaultValue
    }

    // 从当前尺寸开始，向更小的屏幕尺寸查找
    const currentIndex = screenSizeOrder.indexOf(currentSize)
    for (let i = currentIndex; i >= 0; i--) {
      const size = screenSizeOrder[i]
      if (values[size] !== null) {
        return values[size]
      }
    }

    // 如果都没有找到，使用默认值
    return defaultValue
  }

  return {
    row1Cols,
    row2Cols,
    row3Cols,
    row4Cols,
    row6Cols,
    rescols,
  }
}
