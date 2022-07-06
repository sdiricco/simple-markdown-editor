import Vue from 'vue'
import Vuex from 'vuex'

import editor from './modules/editor'
import file from './modules/file'
import handler from './modules/handler'
import markdown from './modules/markdown'
import preview from './modules/preview'
import main from './modules/main'
import error from './modules/error'
import validation from './modules/validations'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {main, editor, file, handler, markdown, preview, error, validation }
})
