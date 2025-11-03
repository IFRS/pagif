export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    showing: false,
    text: '',
    details: undefined,
    color: '',
    icon: '',
  }),

  actions: {
    show(payload) {
      this.showing = true
      this.text = payload.text ?? ''
      this.details = payload.details ?? undefined
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
    info(text, details) {
      this.show({ text, details, type: 'info' })
    },
    success(text, details) {
      this.show({ text, details, type: 'success' })
    },
    warning(text, details) {
      this.show({ text, details, type: 'warning' })
    },
    error(text, details) {
      this.show({ text, details, type: 'error' })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSnackbarStore, import.meta.hot))
}
