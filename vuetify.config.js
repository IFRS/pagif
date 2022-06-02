import colors from 'vuetify/es5/util/colors';
import pt from 'vuetify/lib/locale/pt';

export default {
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      },
    },
  },
}
