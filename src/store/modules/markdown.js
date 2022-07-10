import {markdownParse} from "../../services/electronApi";

const namespaced = true;

const state = {
  loading: false
};

const getters = {
  getIsLoading: (state) => state.loading
}

const actions = {
  async parse({ commit, dispatch, rootGetters }) {
    try {
      commit("setLoading", true)
      const filePath = rootGetters['file/getPath'];
      const editorValue = rootGetters['editor/getValue'];
      const {value, toc} = await markdownParse({path: filePath, value: editorValue})
      console.log("toc", toc)
      await dispatch('preview/setValue', value, {root:true})
      await dispatch('preview/setValueRaw', editorValue, {root:true})
      await dispatch('preview/setToc', toc.html, {root:true})
      await dispatch('preview/setTocRaw', toc.markdown, {root:true})
      commit("setLoading", false)
    } catch (e) {
      commit("setLoading", false)
      throw(e)
    }
  },
};

const mutations = {
  setLoading: (state, value) => state.loading = value 
};


export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
