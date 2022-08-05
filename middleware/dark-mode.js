export default (context) => {
  context.$vuetify.theme.dark = process.server ? context.$cookies.get('darkMode') : context.store.getters['config/darkMode'];
}
