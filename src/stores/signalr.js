import * as signalR from '@microsoft/signalr'
import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useSignalrStore = defineStore('signalr', {
  state: () => ({
    autoConnect: true,
    autoReconnect: true,
    hubs: {
      common: {},
    },
    maxTries: 20,
    reconnectTime: 5000,
    remoteServiceBaseUrl: import.meta.env.VITE_APP_BASE_API,
    url: '/signalr',
    withUrlOptions: {},
    qs: '',
  }),
  actions: {
    // Connect to the server
    connect(qs) {
      if (!signalR) {
        return
      }

      let url = this.url ?? '/' + 'signalr'

      if (qs) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + qs
        this.qs = qs
      }
      const that = this
      this.startConnection(url, this.configureConnection)
        .then(connection => {
          const appStore = useAppStore()
          appStore.event.trigger('abp.signalr.connected')
          // Call the Register method on the hub
          connection.invoke('register').then(() => {
            console.log('Registered to the SignalR server!') // TODO: Remove log
          })
        })
        .catch(error => {
          console.log(error)
          setTimeout(() => {
            that.connect(that.qs)
          }, that.reconnectTime)
        })
    },
    configureConnection(connection) {
      const that = this
      // Reconnect if hub disconnects
      connection.onclose(function (e) {
        if (e) {
          console.log('Connection closed with error: ' + e)
        } else {
          console.log('Disconnected')
        }
        // 尝试重新连接
        that.connect(that.qs)
      })

      this.hubs.common = connection

      const appStore = useAppStore()
      // Register to get notifications
      connection.on('getNotification', notification => {
        appStore.event.trigger('abp.notifications.received', notification)
      })
    },
    // Starts a connection with transport fallback - if the connection cannot be started using
    // the webSockets transport the function will fallback to the serverSentEvents transport and
    // if this does not work it will try longPolling. If the connection cannot be started using
    // any of the available transports the function will return a rejected Promise.
    startConnection(url, configureConnection) {
      if (this.remoteServiceBaseUrl) {
        url = this.remoteServiceBaseUrl + url
      }
      const that = this
      return (function start(transport) {
        console.log(
          'Starting connection using ' + signalR.HttpTransportType[transport] + ' transport',
        )
        that.withUrlOptions.transport = transport
        const connection = new signalR.HubConnectionBuilder()
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: retryContext => {
              console.log('Retry to connect to SignalR')
              const reconnectTime = that.reconnectTime
              if (retryContext.previousRetryCount > that.maxTries) {
                console.log('Max retries reached')
                return reconnectTime * 2
              }
              console.log('Waiting ' + reconnectTime + 'ms before retrying')
              return reconnectTime
            },
          })
          .withUrl(url, that.withUrlOptions)
          .build()

        if (configureConnection && typeof configureConnection === 'function') {
          configureConnection(connection)
        }

        return connection
          .start()
          .then(() => {
            return connection
          })
          .catch(error => {
            console.log(
              'Cannot start the connection using ' +
              signalR.HttpTransportType[transport] +
              ' transport. ' +
              error.message,
            )
            if (transport !== signalR.HttpTransportType.LongPolling) {
              return start(transport + 1)
            }

            throw error
          })
      })(signalR.HttpTransportType.WebSockets)
    },
    stop() {
      if (this.hubs.common) {
        this.hubs.common.stop()
        this.hubs.common = null
        this.qs = ''
      }
    },
    /**
     * 向服务器发送消息
     * @param {*} methodName 方法名，使用 小驼峰，如 sendDemoMessage
     * @param {*} request 参数 字符串或者JSON对象
     * @returns
     */
    sendMessage(methodName, request) {
      if (this.hubs.common && this.hubs.common.invoke) {
        const q = request // typeof request === 'string' ? request : JSON.stringify(request)
        return this.hubs.common.invoke(methodName, q)
      } else {
        throw new Error('Disconnected')
      }
    },
    receiveMessage(methodName, callback) {
      if (this.hubs.common && this.hubs.common.on) {
        this.hubs.common.on(methodName, callback)
        return true
      }
      return false
    },
    offMessage(methodName, callback) {
      if (this.hubs.common && this.hubs.common.off) {
        this.hubs.common.off(methodName, callback)
      }
    },
  },
})
