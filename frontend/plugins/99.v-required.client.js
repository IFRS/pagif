import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.mixin({
    mounted () {
      document.querySelectorAll('[required]').forEach((input) => {
        if (input.closest('.v-field__field')) {
          input.closest('.v-field__field').querySelectorAll('.v-label:not(.v-field-label--floating)').forEach((label) => {
            label.classList.add('v-required')
          })
        }
      })
    },
  })
})
