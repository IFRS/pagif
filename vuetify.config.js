// import colors from 'vuetify/es5/util/colors';
import pt from 'vuetify/es5/locale/pt';

export default {
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    options: { customProperties: true },
    dark: false,
    themes: {
      light: {
        primary: '#1351B4',
        secondary: '#636363',
        accent: '#1351B4',
        error: '#E52207',
        info: '#155BCB',
        success: '#168821',
        warning: '#B38C00',
        footer: '#0C326F',
      },
      dark: {
        primary: '#5992ED',
        secondary: '#565C65',
        accent: '#1351B4',
        error: '#FD8BA0',
        info: '#345D96',
        success: '#4d8055',
        warning: '#E6C74C',
        footer: '#071D41',
      },
    },
  },
}
