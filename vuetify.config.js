// import colors from 'vuetify/es5/util/colors';
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
        secondary: '#636363',
        // accent: '#CD425B',
        accent: '#496FD8',
        error: '#E52207',
        info: '#155BCB',
        success: '#168821',
        warning: '#FFCD07',
        footer: '#0C326F',
      },
      dark: {
        primary: '#C5D4EB',
        secondary: '#C6CACE',
        // accent: '#F8B9C5',
        accent: '#5E519E',
        error: '#FDE0DB',
        info: '#D4E5FF',
        success: '#E3F5E1',
        warning: '#FFF5C2',
        footer: '#071D41',
      },
    },
  },
}
