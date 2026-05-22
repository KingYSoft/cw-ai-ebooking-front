// Utilities
import { defineStore } from 'pinia'
import { userChangeSetting } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({}),
  actions: {
    /**
     * update user setting
     * @param {*} name setting name
     * @param {*} value setting value
     */
    async changeSetting(name, value) {
      try {
        await userChangeSetting({
          setting_name: name,
          setting_value: value,
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
})
