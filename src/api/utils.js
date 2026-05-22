export const debounceFn = (fn, delay = 300) => {
  let timer = null
  let controller = null
  return async (...args) => {
    if (timer) {
      clearTimeout(timer)
    }
    if (controller) {
      controller.abort()
    }
    timer = setTimeout(async () => {
      controller = new AbortController()

      if (fn) {
        await fn(...args, controller.signal)
      }
    }, delay)
  }
}
