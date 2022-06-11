import * as nodeApi from "../../services/nodeApi"
import * as electronApi from "../../services/electronApi"
const namespaced = true;

const state = {
  previewer: {
    content: "",
  },
  file: {
    name: "",
    content: "",
    ext: "",
    path: "",
    stat: {},
  },
  modified: false,
};

const getters = {
  getFile: (state) => state.file,
  getPreviewer: (state) => state.previewer,
};

const actions = {

  async readFile({commit}, data = {path: ""}){
    try {
      const result = await nodeApi.readFile(data.path);
      commit("setFile", result.file);
      return result.file;
    } catch (e) {
      console.log("error in actions.readFile", e.message);
      throw(e)
    }
  },

  async markdownToHtml({commit}, data = {content: ''}){
    try {
      const result = await electronApi.markdownParse({content: data.content});
      commit("setPreviewer", result)
    } catch (e) {
      console.log("Error in actions.markdownToHtml", e.message);
      throw(e)
    }
  },


  async loadMarkdownFile({dispatch}, data = {path: ""}){
    try {
      const file = await dispatch('readFile', {path: data.path});
      await dispatch('markdownToHtml', {content: file.content})
    } catch (e) {
      console.log("Error in actions.loadMarkdownFile", e.message);
      throw(e)
    }
  },

};




const mutations = {
  setFile: (state, data) => (state.file = data),
  setPreviewer: (state, data) => (state.previewer = data)
};




export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
