import * as nodeApi from "../../services/nodeApi";
import * as electronApi from "../../services/electronApi";
import * as electronWrapper from "../../services/electronWrapper";
import * as validation from "../../services/validation";
import path from "path"

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
        ext: result.file.ext,
      });
      commit("setInitialFile", {
        name: result.file.name,
        path: result.file.path,
        content: result.file.content,
        ext: result.file.ext,
        stat: result.file.stat,
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
      const result = await electronApi.markdownParse({ content: data.content, path: data.path });
      console.log("result", result);
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

  /**********************************************************************************/
  /* PUBLIC HANDLES */

  /* On Click: Menu > File > Save */
  async handleOnMenuSave({ dispatch, getters }) {
    if (!getters.getIsFileModified) {
      return;
    }
    if (getters.getInitialFile.path === "") {
      await dispatch('handleOnMenuSaveAs');
      return;
    }
    await dispatch("saveFile", {
      path: getters.getInitialFile.path,
      content: getters.getEditedFile.content,
    });
  },

  /* On Click: Menu > File > Save as */
  async handleOnMenuSaveAs({ dispatch, getters }) {
    const { canceled, filePath } = await electronWrapper.showSaveDialog();
    if (canceled) {
      return;
    }
    await dispatch("saveFile", {
      path: filePath,
      content: getters.getEditedFile.content,
    });
  },

  //On Click: Menu > File > Open
  async handleOnMenuOpen({dispatch, getters}) {
    try {
      //if file has changed, show message info.
      //1 - if user click on cancel, siply return
      //2 - if user click on ok, continue choosing file from open dialog
      if (getters.getIsFileModified) {
        const {canceled} = await electronWrapper.showMessageQuestion(
          "The file has changed. Are you sure you want to open a new file without saving?"
        );
        if (canceled) return;
      }
      //chose a file from open dialog
      //1 - if canceled, simply return
      //2 - if choosing a file, return the path
      const {canceled, filePath} = await electronWrapper.showOpenDialog();
      if (canceled) return;

      await validation.validateFile(filePath);
      await dispatch('loadMarkdownFile', {path: filePath });

    } catch (e) {
      await electronWrapper.showErrorBox(
        `Error during opening file: ${e.message}\n\n${
          e.details ? "Details: " + e.details : ""
        }`
      );
    }
  },

  //On Drop files
  async handleDropFiles({dispatch}, data={files: []}){
    try {
      const filePaths = Object.values(data.files).map((f) => f.path);
      console.log("files", filePaths);
      await validation.validateFiles(filePaths);
      await dispatch('loadMarkdownFile', { path: filePaths[0] });
    } catch (e) {
      console.log(e.message);
      console.log(e.details);
      await electronWrapper.showErrorBox(
        `Error during the drop files: ${e.message}\n\n${
          e.details ? "Details: " + e.details : ""
        }`
      );
    }
  },

  async init({dispatch}){
    try {
      //get the app args
      const {args} = await electronApi.reanderReady();

      //filter only md files
      const files = args.filter(a => path.extname(a) === ".md")

      //If there are not files, simply returns
      if (!files.length) {
        console.log("App launched without any files");
        return;
      }
      
      //Only one file is supported
      await dispatch('loadMarkdownFile', { path: files[0] });
    } catch (e) {
      console.log(e.message);
      console.log(e.details);
      throw e;
    }
  }

  
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
