import {markdownParse, markdownToc} from "../../services/electronApi";

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
      const {value} = await markdownParse({path: filePath, value: editorValue})
      await dispatch('preview/setValue', value, {root:true})
      await dispatch('preview/setValueRaw', editorValue, {root:true})
      await dispatch('generateToc')
      commit("setLoading", false)
    } catch (e) {
      commit("setLoading", false)
      throw(e)
    }
  },
  async generateToc({dispatch, rootGetters}){
    const editorValue = rootGetters['editor/getValue'];
    const {value} = await markdownToc({value: editorValue})
    await dispatch('preview/setToc', value, {root:true})
  }
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
