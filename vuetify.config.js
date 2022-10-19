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
      light: {
        primary: '#1351B4',
        secondary: '#636363', // não faz parte do DS
        accent: '#CD425B', // não faz parte do DS
        error: '#E52207',
        info: '#155BCB',
        success: '#168821',
        warning: '#FFCD07',
      },
      dark: {
        primary: '#C5D4EB',
        secondary: '#C6CACE', // não faz parte do DS
        accent: '#F8B9C5', // não faz parte do DS
        error: '#FDE0DB',
        info: '#D4E5FF',
        success: '#E3F5E1',
        warning: '#FFF5C2',
      },
    },
  },
}
