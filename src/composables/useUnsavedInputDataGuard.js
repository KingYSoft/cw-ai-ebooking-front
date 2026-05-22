import { computed, getCurrentInstance, onBeforeUnmount, ref, toRaw, unref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

// 将 inputData 转成稳定结构，避免对象 key 顺序或 Vue 代理对象影响脏数据判断。
const normalizeForSnapshot = (value, seen = new WeakSet()) => {
  const rawValue = toRaw(unref(value))

  if (rawValue === null || typeof rawValue !== 'object') {
    return rawValue
  }

  if (rawValue instanceof Date) {
    return rawValue.toISOString()
  }

  if (seen.has(rawValue)) {
    return null
  }
  seen.add(rawValue)

  if (Array.isArray(rawValue)) {
    return rawValue.map(item => normalizeForSnapshot(item, seen))
  }

  return (
    Object.keys(rawValue)
      // 函数和 symbol 不属于页面录入值，生成快照时忽略。
      .filter(key => typeof rawValue[key] !== 'function' && typeof rawValue[key] !== 'symbol')
      .sort()
      .reduce((result, key) => {
        result[key] = normalizeForSnapshot(rawValue[key], seen)
        return result
      }, {})
  )
}

// 生成当前 inputData 的字符串快照，用于和保存后的快照比较。
const createInputDataSnapshot = value => {
  try {
    return JSON.stringify(normalizeForSnapshot(value))
  } catch {
    return ''
  }
}

// tab 的 value 和 default layout 中的生成规则保持一致，动态页面追加 pk。
const resolveTabValueFromRoute = route => {
  const routeName = route.name?.toString?.() || ''
  const pk = route.params?.pk?.toString?.()
  return pk ? `${routeName}-${pk}` : routeName
}

// 注册页面 inputData 未保存拦截，覆盖 tab 关闭、页面跳转、浏览器刷新和关闭。
export function useUnsavedInputDataGuard(inputData, options = {}) {
  const route = options.route || (options.tabValue ? null : useRoute())
  const appStore = useAppStore()

  const tabValue = computed(() => options.tabValue || resolveTabValueFromRoute(route || {}))
  const savedSnapshot = ref(createInputDataSnapshot(inputData))
  const registeredTabValue = ref('')

  // 页面查询完成或保存成功后调用，刷新“已保存”的基准快照。
  const markInputDataSaved = () => {
    savedSnapshot.value = createInputDataSnapshot(inputData)
  }

  // 每次关闭或跳转前重新生成快照，确保深层字段变化也能被识别。
  const hasUnsavedInputData = () => {
    if (!tabValue.value) {
      return false
    }
    // console.log(createInputDataSnapshot(inputData))
    // console.log(savedSnapshot.value)

    return createInputDataSnapshot(inputData) !== savedSnapshot.value
  }

  // 页面卸载或 tab value 变化时，移除旧的检查器，避免关闭不存在的 tab 时误判。
  const stop = () => {
    if (registeredTabValue.value) {
      appStore.unregisterUnsavedInputDataGuard(registeredTabValue.value)
      registeredTabValue.value = ''
    }
  }

  // 将当前页面的未保存检查器登记到全局 store，layout 和 router 统一读取。
  const register = nextTabValue => {
    if (!nextTabValue || nextTabValue === registeredTabValue.value) {
      return
    }
    stop()
    registeredTabValue.value = nextTabValue
    appStore.registerUnsavedInputDataGuard(nextTabValue, hasUnsavedInputData)
  }

  // 浏览器刷新或关闭只能触发原生 beforeunload 提示，不能展示自定义 v-dialog。
  const onBeforeUnload = event => {
    if (!hasUnsavedInputData()) {
      return
    }
    event.preventDefault()
    event.returnValue = ''
  }

  register(tabValue.value)
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', onBeforeUnload)
  }

  // keep-alive 页面复用时，路由参数变化会导致 tab value 变化，需要重新注册。
  if (getCurrentInstance()) {
    watch(tabValue, register)
  }

  // 组件卸载时同步清理浏览器事件和全局 guard。
  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', onBeforeUnload)
      }
      stop()
    })
  }

  return {
    markInputDataSaved,
    hasUnsavedInputData,
    stop: () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', onBeforeUnload)
      }
      stop()
    },
  }
}
