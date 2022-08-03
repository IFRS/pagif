export default (context) => {
  context.$vuetify.theme.dark = context.$cookies.get('darkMode');
}
