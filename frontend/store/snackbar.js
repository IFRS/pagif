import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    showing: false,
    text: '',
    color: '',
    icon: '',
  }),

  actions: {
    show(payload) {
      this.showing = true
      this.text = payload.text
      switch (payload.type) {
        case 'info':
          this.color = 'info'
          this.icon = 'mdi-information'
          break
        case 'success':
          this.color = 'success'
          this.icon = 'mdi-check'
          break
        case 'warning':
          this.color = 'warning'
          this.icon = 'mdi-alert'
          break
        case 'error':
          this.color = 'error'
          this.icon = 'mdi-close-circle'
          break
        default:
          this.color = ''
          this.icon = ''
          break
      }
    },
    hide() {
      this.$reset()
    },
    info (text) {
      this.show({ text, type: 'info' })
    },
    success (text) {
      this.show({ text, type: 'success' })
    },
    warning (text) {
      this.show({ text, type: 'warning' })
    },
    error (text) {
      this.show({ text, type: 'error' })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSnackbarStore, import.meta.hot))
}
