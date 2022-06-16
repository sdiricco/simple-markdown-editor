import * as nodeApi from "../../services/nodeApi"
import * as electronApi from "../../services/electronApi"
const namespaced = true;

const state = {
  builtFile: {
    content: "",
  },
  editedFile:{
    new: "",
    content: ""
  },
  initialFile: {
    name: "",
    content: "",
    ext: "",
    path: "",
    stat: {},
  },
  machineState: {
    isLoadingFile: false,
    isSavingFile: false,
    isBuildingFile: false,
    isReadingFile: false
  },
};

const getters = {
  getInitialFile: (state) => state.initialFile,
  getEditedFile: (state) => state.editedFile,
  getBuiltFile: (state) => state.builtFile,
  getIsFileModified: (state) => state.editedFile.content !== state.initialFile.content,
  getMachineState: (state) => state.machineState,

};

const actions = {

  async readFile({commit, getters}, data = {path: ""}){
    try {
      commit("setIsReadingFile", true);
      const filePath = getters.getInitialFile.path || data.path;
      const result = await nodeApi.readFile(filePath);
      commit("setInitialFile", result.file);
      commit("setEditedFile", {content: result.file.content, new: true});
      commit("setIsReadingFile", false);
      return result.file;
    } catch (e) {
      commit("setIsReadingFile", false);
      console.log("error in actions.readFile", e.message);
      throw(e)
    }
  },

  async saveFile({commit, dispatch, getters}, data = {path: null}){
    try {
      commit("setIsSavingFile", true);
      const filePath = getters.getInitialFile.path || data.path;
      const fileContent = getters.getEditedFile.content;
      await nodeApi.saveFile({path: filePath, content: fileContent});
      await dispatch("readFile", {path: filePath})
      commit("setIsSavingFile", false)
    } catch (e) {
      commit("setIsSavingFile", false)
      console.log("Error in actions.saveFile", e.message);
      throw(e)
    }
  },

  async buildFile({dispatch, getters}){
    try {
      await dispatch("markdownToHtml", {content: getters.getEditedFile.content})
    } catch (e) {
      console.log("Error in actions.buildFile", e.message);
    }
  },

  async markdownToHtml({commit}, data = {content: ''}){
    try {
      commit("setIsBuildingFile", true)
      const result = await electronApi.markdownParse({content: data.content});
      commit("setBuiltFile", result)
      commit("setIsBuildingFile", false)
    } catch (e) {
      commit("setIsBuildingFile", false)
      console.log("Error in actions.markdownToHtml", e.message);
      throw(e)
    }
  },


  async loadMarkdownFile({dispatch, commit}, data = {path: ""}){
    try {
      commit("setIsLoadingFile", true)
      const file = await dispatch('readFile', {path: data.path});
      await dispatch('markdownToHtml', {content: file.content})
      commit("setIsLoadingFile", false)
    } catch (e) {
      commit("setIsLoadingFile", false)
      console.log("Error in actions.loadMarkdownFile", e.message);
      throw(e)
    }
  },

  async setEditedFile({commit}, data = {content: ''}){
    commit("setEditedFile", {content:data.content, new: false});
  }
};

const mutations = {
  setInitialFile: (state, data) => (state.initialFile = data),
  setEditedFile: (state, data) => (state.editedFile = data),
  setBuiltFile: (state, data) => (state.builtFile = data),
  setIsReadingFile: (state, data) => (state.machineState.isReadingFile = data),
  setIsSavingFile: (state, data) => (state.machineState.isSavingFile = data),
  setIsBuildingFile: (state, data) => (state.machineState.isBuildingFile = data),
  setIsLoadingFile: (state, data) => (state.machineState.isLoadingFile = data),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
