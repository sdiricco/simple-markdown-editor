import Vue from "vue";
import Vuetify from "vuetify/lib";

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    themes: {
      light: {
        primary: colors.purple,
      },
      dark: {
        primary: colors.blue.lighten3,
      },
    },
  },
});
