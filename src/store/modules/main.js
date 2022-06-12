import * as nodeApi from "../../services/nodeApi"
import * as electronApi from "../../services/electronApi"
const namespaced = true;

const state = {
  builtFile: {
    content: "",
  },
  editedFile:{
    content: ""
  },
  initialFile: {
    name: "",
    content: "",
    ext: "",
    path: "",
    stat: {},
  },
  isAppLoading: false,
  isSaving: false,
  isFileModified: false,
};

const getters = {
  getInitialFile: (state) => state.initialFile,
  getEditedFile: (state) => state.editedFile,
  getBuiltFile: (state) => state.builtFile,
  getIsFileModified: (state) => state.editedFile.content !== state.initialFile.content,
  getIsAppLoading: (state) => state.isAppLoading,
  getIsSaving: (state) => state.isSaving

};

const actions = {

  async readFile({commit}, data = {path: ""}){
    try {
      const result = await nodeApi.readFile(data.path);
      commit("setInitialFile", result.file);
      commit("setEditedFile", {content: result.file.content});
      return result.file;
    } catch (e) {
      console.log("error in actions.readFile", e.message);
      throw(e)
    }
  },

  async saveFile({commit, dispatch, getters}, data = {path: ''}){
    try {
      commit("setIsSaving", true);
      await electronApi.saveFile({path: data.path, content: getters.getEditedFile.content});
      await dispatch("readFile", {path: data.path})
      commit("setIsSaving", false)
    } catch (e) {
      commit("setIsSaving", false)
      console.log("Error in actions.saveFile", e.message);
      throw(e)
    }
  },

  async markdownToHtml({commit}, data = {content: ''}){
    try {
      const result = await electronApi.markdownParse({content: data.content});
      commit("setBuiltFile", result)
    } catch (e) {
      console.log("Error in actions.markdownToHtml", e.message);
      throw(e)
    }
  },


  async loadMarkdownFile({dispatch, commit}, data = {path: ""}){
    try {
      commit("setIsAppLoading", true)
      const file = await dispatch('readFile', {path: data.path});
      await dispatch('markdownToHtml', {content: file.content})
      commit("setIsAppLoading", false)
    } catch (e) {
      commit("setIsAppLoading", false)
      console.log("Error in actions.loadMarkdownFile", e.message);
      throw(e)
    }
  },

};




const mutations = {
  setInitialFile: (state, data) => (state.initialFile = data),
  setEditedFile: (state, data) => (state.editedFile = data),
  setBuiltFile: (state, data) => (state.builtFile = data),
  setIsAppLoading: (state, data) => (state.isAppLoading  = data),
  setIsSaving: (state, data) => (state.isSaving = data)
};




export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
