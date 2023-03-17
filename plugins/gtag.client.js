import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app, store }) => {
  if (app.$config.GA) {
    Vue.use(VueGtag, {
      enabled: !store.getters['config/dnt'],
      config: {
        id: app.$config.GA,
        params: {
          send_page_view: false
        }
      },
      appName: app.name,
      pageTrackerScreenviewEnabled: true
    }, app.router);
  }
}
