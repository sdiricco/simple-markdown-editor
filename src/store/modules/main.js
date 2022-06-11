import * as electronApi from "../../services/electronApi";
import { ipcRenderer } from "electron";

const namespaced = true;

const state = {
  previewer: {
    content: "",
  },
  file: {
    name: "",
    content: "",
    path: "",
    stat: {},
    modified: false,
  },
};

const getters = {
  getFile: (state) => state.file,
  getPreviewer: (state) => state.previewer,
};

const actions = {
  async markdownParse({ commit }, data = { content: "" }) {
    const response = await electronApi.markdownParse(data.content);
    commit("setHtml", response.data);
  },

  //get args when open app
  async getAppsArgs(){
    return await electronApi.getAppArgs();
  },

  //If file is edit ask user confirmation
  async askUserConfirmation(){
    if (!state.editFile.modified) return true;
    const response = await electronApi.showError("File modified. Are you sure to open a new file and discard all changes?");
    return !response.data.canceled
  },

  async validationFilesOnDragAndDrop(_store, data = {files: []}){
    if (data.files.length > 1) {
      await electronApi.showError("Select one file please");
      return false;
    }
    return true;
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

  async loadFileFromPath({dispatch, commit}, data = {path: ""}){

    const file = await dispatch("readFile", {path: data.path});
    const additionalFields = {
      modified: false,
      html: "",
    };
    commit("setFile", file);
    commit("setEditFile", {...file, ...additionalFields})
  },

  async saveAsFileHandler({state}){
    let response = await electronApi.saveDialog({
      content: this.editFile.content,
      options: this.electron.saveDialogOptions,
    });
  },

  async saveFileHandler(){

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

    await dispatch("loadFileFromPath", {path: filePath})

  },

  async openFileFromDragAndDrop({dispatch}, data = {files: []}){
    const isValid = await dispatch("validationFilesOnDragAndDrop", {files: data.files});
    if (!isValid) return;
    const confirm = await dispatch("askUserConfirmation")
    if (!confirm) return;

    const filePath = files[0].path;
    await dispatch("loadFileFromPath", {path: filePath})
  },

  async loadApp({dispatch}){

    //check if app is open with file
    const file = await dispatch("getAppsArgs")
    if (!file.exsist) {
      return;
    }

    //if path is open with a file, load the file
    await dispatch("loadFileFromPath", {path: file.path})

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
