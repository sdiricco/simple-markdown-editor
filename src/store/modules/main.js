import * as electronApi from "../../services/electronApi";
const namespaced = true;

const state = {
  html: "",
  file: {
    name: "",
    content: "",
    path: "",
    stat: {},
  },
  editFile: {
    name: "",
    content: "",
    html: "",
    path: "",
    stat: {},
    modified: false,
  },
  error: false,
  errorMessage: "",
  dialogElectronError: false,
  dialogElectronMessage: "",
};

const getters = {
  getHtml: (state) => state.html,
  getEditFile: (state) => state.editFile,
  getError: (state) => state.error,
  getErrorMessage: (state) => state.errorMessage,
};

const actions = {
  async markdownParse({ commit }, data = { content: "" }) {
    const response = await electronApi.markdownParse(data.content);
    commit("setHtml", response.data);
  },

  //If file is edit ask user confirmation
  async askUserConfirmation(){
    if (!state.editFile.modified) return true;
    const response = await electronApi.showError("File modified. Are you sure to open a new file and discard all changes?");
    return !response.data.canceled
  },

  //get path of file from open dialog
  async getPathFromOpenDialog(_store, data = {openDialogOptions: {}}){
    const response = await electronApi.openDialogFile({
        options: data.openDialogOptions,
      });
    return response.data.path;
  },

  //read file
  async readFile(_store, data = {path: ""}){
    const response = await electronApi.readFile({ path: data.path });
    console.log("response", response);
    return response.data.file;
  },

  async openFileFromDialog({dispatch, commit},
    {
      openDialogOptions = {},
      askUserConfirmation = true
    } = {}
  ) {

    if (askUserConfirmation) {
      const confirm = await dispatch("askUserConfirmation")
      if (!confirm) return;
    }

    const filePath = await dispatch("getPathFromOpenDialog", {openDialogOptions: openDialogOptions})
    if (!filePath) return;
    const file = await dispatch("readFile", {path: filePath});
    const additionalFields = {
      modified: false,
      html: "",
    };
    commit("setFile", file);
    commit("setEditFile", {...file, ...additionalFields})

  },
};

const mutations = {
  setHtml: (state, data) => (state.html = data.html),
  setFile: (state, data) => (state.file = data),
  setEditFile: (state, data) => (state.editFile = data),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
