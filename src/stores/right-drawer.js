import { defineStore } from 'pinia'

export const useRightDrawerStore = defineStore('right-drawer', {
  state: () => ({
    drawerName: '',
    diaVis: false,
    diaMode: 'add',
    diaLoading: false,
    inputData: {},
    diaTitle: '',
    drawerEvents: {},
  }),
  actions: {
    openRightDrawer(drawerName, diaMode, inputData, diaTitle, drawerEvents) {
      this.drawerName = drawerName ?? ''
      this.diaMode = diaMode ?? 'add'
      this.inputData = inputData ?? {}
      this.diaTitle = diaTitle ?? ''
      this.drawerEvents = drawerEvents ?? {}
      this.diaVis = true
    },
    closeRightDrawer() {
      this.diaVis = false
      this.diaMode = 'add'
    },
  },
})
