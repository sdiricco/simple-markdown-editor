import * as nodeApi from "../../services/nodeApi";
import * as electronApi from "../../services/electronApi";
const namespaced = true;

const state = {
  builtFile: {
    content: "",
    html: "",
  },
  editedFile: {
    name: "",
    path: "",
    ext: "",
    content: "",
  },
  openNewFile: false,
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
    isReadingFile: false,
  },
};

const getters = {
  getOpenNewFile: (state) => state.openNewFile,
  getInitialFile: (state) => state.initialFile,
  getEditedFile: (state) => state.editedFile,
  getBuiltFile: (state) => state.builtFile,
  getIsFileModified: (state) =>
    state.editedFile.content !== state.initialFile.content,
  getMachineState: (state) => state.machineState,
};

const actions = {
  async readFile({ commit }, data = { path: "" }) {
    try {
      console.log("STORE > ACTIONS > readFile");
      commit("setIsReadingFile", true);
      const result = await nodeApi.readFile(data.path);
      commit("setEditedFile", {
        name: result.file.name,
        path: result.file.path,
        content: result.file.content,
        ext: result.file.ext
      });
      commit("setInitialFile", {
        name: result.file.name,
        path: result.file.path,
        content: result.file.content,
        ext: result.file.ext,
        stat: result.file.stat
      });
      commit("setIsReadingFile", false);
      return result.file;
    } catch (e) {
      commit("setIsReadingFile", false);
      console.log("error in actions.readFile", e.message);
      throw e;
    }
  },

  async saveFile({ commit, dispatch }, data = { path: null, content: null }) {
    try {
      console.log("STORE > ACTIONS > saveFile");
      commit("setIsSavingFile", true);
      await nodeApi.saveFile({ path: data.path, content: data.content });
      await dispatch("readFile", { path: data.path });
      commit("setIsSavingFile", false);
    } catch (e) {
      commit("setIsSavingFile", false);
      console.log("Error in actions.saveFile", e.message);
      throw e;
    }
  },

  async buildFile({ commit }, data = { content: "", path: "" }) {
    try {
      console.log("STORE > ACTIONS > markdownToHtml");
      commit("setIsBuildingFile", true);
      await electronApi.setMarkdownPath(data.path);
      const result = await electronApi.markdownParse({ content: data.content });
      commit("setBuiltFile", { html: result.content, content: data.content });
      commit("setIsBuildingFile", false);
    } catch (e) {
      commit("setIsBuildingFile", false);
      console.log("Error in actions.markdownToHtml", e.message);
      throw e;
    }
  },

  async loadMarkdownFile({ dispatch, commit }, data = { path: "" }) {
    try {
      console.log("STORE > ACTIONS > loadMarkdownFile");
      commit("setIsLoadingFile", true);
      commit("setOpenNewFile", false);
      await dispatch("readFile", { path: data.path });
      // await dispatch('markdownToHtml', {path: data.path, content: file.content});
      commit("setOpenNewFile", true);
      commit("setIsLoadingFile", false);
    } catch (e) {
      commit("setOpenNewFile", false);
      commit("setIsLoadingFile", false);
      console.log("Error in actions.loadMarkdownFile", e.message);
      throw e;
    }
  },

  async setFileContent({ commit }, data = { content: "" }) {
    commit("setFileContent", data.content);
    commit("setOpenNewFile", false);
  },
};

const mutations = {
  setOpenNewFile: (state, data) => (state.openNewFile = data),
  setInitialFile: (state, data) => (state.initialFile = data),
  setEditedFile: (state, data) => (state.editedFile = data),
  setFileContent: (state, data) => (state.editedFile.content = data),
  setBuiltFile: (state, data) => (state.builtFile = data),
  setIsReadingFile: (state, data) => (state.machineState.isReadingFile = data),
  setIsSavingFile: (state, data) => (state.machineState.isSavingFile = data),
  setIsBuildingFile: (state, data) =>
    (state.machineState.isBuildingFile = data),
  setIsLoadingFile: (state, data) => (state.machineState.isLoadingFile = data),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
