import colors from 'vuetify/es5/util/colors';
import pt from 'vuetify/es5/locale/pt';

export default {
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        secondary: colors.amber.darken3,
        accent: colors.grey.darken3,
        error: colors.deepOrange.accent4,
        info: colors.teal.lighten1,
        success: colors.green.accent3,
        warning: colors.amber.base,
      },
    },
  },
}
