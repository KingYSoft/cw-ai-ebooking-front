import { computed, getCurrentInstance, onBeforeUnmount, ref, unref } from 'vue'
import { acquireEditLock, releaseEditLock } from '@/api/edit_lock'
import { useAppStore } from '@/stores/app'
import { useSignalrStore } from '@/stores/signalr'

const DEFAULT_BLOCK_MESSAGE = 'Another user is editing, cannot save....'

export function useEditLockGuard(options = {}) {
  const appStore = useAppStore()
  const signalrStore = useSignalrStore()

  const businessType = computed(() => String(unref(options.businessType) || '').trim())
  const pk = computed(() => String(unref(options.pk) || '').trim())

  const lockMessage = ref('')
  const ownsLock = ref(false)
  const messageListening = ref(false)
  const pageHideListening = ref(false)

  const isSaveBlocked = computed(() => Boolean(lockMessage.value))
  const lockWarningText = computed(() => lockMessage.value)

  const buildPayload = () => ({
    business_type: businessType.value,
    pk: pk.value,
  })

  const isCurrentRecord = lock => {
    return (
      lock &&
      String(lock.businessType || '').toLowerCase() === businessType.value.toLowerCase() &&
      String(lock.pk || '') === pk.value
    )
  }

  const buildBeaconUrl = () => {
    const baseUrl = import.meta.env.VITE_APP_BASE_API || ''
    const params = new URLSearchParams(buildPayload())
    const token = sessionStorage.getItem('token')
    if (token) {
      params.set('enc_auth_token', token)
    }
    return `${baseUrl}/api/edit-lock/release-beacon?${params.toString()}`
  }

  const releaseLockByBeacon = () => {
    if (!businessType.value || !pk.value || !ownsLock.value) {
      return
    }

    // 页面关闭时不能依赖普通异步请求，优先使用 sendBeacon 立即释放后端占用。
    const url = buildBeaconUrl()
    if (navigator?.sendBeacon) {
      navigator.sendBeacon(url)
      return
    }

    fetch(url, {
      method: 'POST',
      keepalive: true,
    }).catch(error => {
      console.log('release edit lock beacon failed:', error)
    })
  }

  const registerPageHideRelease = () => {
    if (pageHideListening.value || typeof window.addEventListener !== 'function') {
      return
    }

    window.addEventListener('pagehide', releaseLockByBeacon)
    pageHideListening.value = true
  }

  const unregisterPageHideRelease = () => {
    if (!pageHideListening.value || typeof window.removeEventListener !== 'function') {
      return
    }

    window.removeEventListener('pagehide', releaseLockByBeacon)
    pageHideListening.value = false
  }

  const applyLockResult = result => {
    if (!result || !isCurrentRecord(result.lock)) {
      return
    }

    if (result.blocked) {
      ownsLock.value = false
      lockMessage.value = result.message || DEFAULT_BLOCK_MESSAGE
      return
    }

    if (result.acquired) {
      ownsLock.value = true
      lockMessage.value = ''
      registerPageHideRelease()
      return
    }

    ownsLock.value = false
    lockMessage.value = ''
    unregisterPageHideRelease()
  }

  const acquireLock = async () => {
    if (!businessType.value || !pk.value) {
      return true
    }

    try {
      const { data } = await acquireEditLock(buildPayload())
      applyLockResult(data)
      return !data?.blocked
    } catch {
      ownsLock.value = false
      lockMessage.value = 'Connection lost. Saving is disabled until the edit lock is restored.'
      return false
    }
  }
  const releaseLock = async () => {
    unregisterPageHideRelease()

    if (!businessType.value || !pk.value || !ownsLock.value) {
      return
    }

    try {
      await releaseEditLock(buildPayload())
    } catch (error) {
      console.log('release edit lock failed:', error)
    } finally {
      ownsLock.value = false
      lockMessage.value = ''
    }
  }

  const ensureCanSave = () => {
    if (!isSaveBlocked.value) {
      return true
    }
    appStore.openMessage({
      content: lockMessage.value || DEFAULT_BLOCK_MESSAGE,
      color: 'warning',
    })
    return false
  }

  const onEditLockChanged = result => {
    const wasBlocked = isSaveBlocked.value
    if (
      wasBlocked &&
      result &&
      !result.blocked &&
      !result.acquired &&
      isCurrentRecord(result.lock)
    ) {
      // 被锁用户收到释放通知后先保持禁止保存，抢锁成功后才真正变成可编辑。
      lockMessage.value = lockMessage.value || DEFAULT_BLOCK_MESSAGE
      acquireLock()
      return
    }

    applyLockResult(result)
  }

  const registerLockMessage = () => {
    if (messageListening.value) {
      return
    }
    messageListening.value = signalrStore.receiveMessage('editLockChanged', onEditLockChanged)
  }

  const onSignalrConnected = () => {
    registerLockMessage()
    acquireLock()
  }

  appStore.event.on('abp.signalr.connected', onSignalrConnected)
  registerLockMessage()

  const stop = () => {
    if (messageListening.value) {
      signalrStore.offMessage?.('editLockChanged', onEditLockChanged)
      messageListening.value = false
    }
    unregisterPageHideRelease()
    appStore.event.off('abp.signalr.connected', onSignalrConnected)
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      releaseLock()
      stop()
    })
  }

  return {
    lockWarningText,
    isSaveBlocked,
    acquireLock,
    releaseLock,
    ensureCanSave,
    stop,
  }
}
