import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    options: {customProperties: true},
    themes: {
      light: {
        primary: colors.blue.lighten1,
        accent: colors.pink,
        background: '#282a36'
      },
      dark: {
        primary: colors.blue.lighten1,
        background: '#282a36'

      },
    },
  },
});
