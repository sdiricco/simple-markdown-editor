import * as electronApi from "../../services/electronApi";
import * as electronWrapper from "../../services/electronWrapper";
import * as validation from "../../services/validation";
import path from "path";
// import { ipcRenderer } from "electron";


const namespaced = true;

const getters = {
  getFileHasChanged: (_state, _getters, _rootState, rootGetters) =>
    rootGetters["file/getValue"] !== rootGetters["editor/getValue"],
};

const actions = {

  /* On Click: Menu > File > Save */
  async onMenuSave({ dispatch, rootGetters }) {
    try {
      const filePath = rootGetters["file/getPath"];
      const editorValue = rootGetters["editor/getValue"];
      if (filePath === "") {
        await dispatch("onMenuSaveAs");
        return;
      }
      await dispatch("file/save", { filePath: filePath, value: editorValue }, { root: true }); 
    } catch (error) {
      await dispatch('error/electron', {message: 'Error during saving file.', error: error}, {root:true})
    }
  },

  /* On Click: Menu > File > Save as */
  async onMenuSaveAs({ dispatch, rootGetters }) {
    try {
      const { canceled, filePath } = await electronWrapper.showSaveDialog();
      if (canceled) {
        return;
      }
      const editorValue = rootGetters["editor/getValue"];
      await dispatch("file/save", { filePath: filePath, value: editorValue }, { root: true });
    } catch (error) {
      await dispatch('error/electron', {message: 'Error during saving file.', error: error}, {root:true})
    }
  },

  //On Click: Menu > File > Open
  async onMenuOpen({ dispatch, getters }) {
    try {
      if (getters.getFileHasChanged) {
        const { response } = await electronWrapper.showMessageQuestion(
          "The file has changed. Are you sure you want to open a new file without saving?"
        );
        if (response.cancel) {
          return;
        }
      }
      const { canceled, filePath } = await electronWrapper.showOpenDialog();
      if (canceled) {
        return;
      }
      await validation.validateFile(filePath);
      await dispatch('loadFile', {filePath: filePath})
    } catch (error) {
      await dispatch('error/electron', {message: 'Error during opening file.', error: error}, {root:true})
    }
  },

  //On Drop files
  async onDropFiles({ dispatch, getters }, data = { files: [] }) {
    try {
      if (getters.getFileHasChanged) {
        const { response } = await electronWrapper.showMessageQuestion(
          "The file has changed. Are you sure you want to open a new file without saving?"
        );
        if (response.cancel) {
          return;
        }
      }
      const filePaths = Object.values(data.files).map((f) => f.path);
      console.log("files", filePaths);
      await validation.validateFiles(filePaths);
      await dispatch('loadFile', {filePath: filePaths[0]})
    } catch (error) {
      await dispatch('error/electron', {message: 'Error during the drop files.', error: error}, {root:true})
    }
  },

  //During the initialization
  async onInit({ dispatch }) {
    try {
      dispatch('attachElectronListener')
      dispatch('main/watchLocationHash', null, {root:true})
      //get the app args
      const { args } = await electronApi.reanderReady();
      //filter only md files
      const filePaths = args.filter((a) => path.extname(a) === ".md");
      //If there are not files, simply returns
      if (!filePaths.length) {
        console.log("App launched without any files");
        return;
      }
      await dispatch('loadFile', {filePath: filePaths[0]})
    } catch (error) {
      await dispatch('error/electron', {message: 'Error during the initialization phase.', error: error}, {root:true})
    }
  },


  async loadFile({dispatch}, {filePath = ''}){
    let { value } = await dispatch("file/read", filePath, { root: true });
    await dispatch("editor/setValue", value, { root: true });
    await dispatch("editor/reload", null, { root: true });
  },

  async onMenuPreferences({dispatch}){
    dispatch("main/showSettings", null, {root: true})
  },

  async onToggleView({dispatch}){
    dispatch("main/toggleView", null, {root: true})
  },

  attachElectronListener({dispatch}){
    electronApi.listeners.onClickOpenFile = () => dispatch("onMenuOpen")
    electronApi.listeners.onClickSaveFile = () => dispatch("onMenuSave")
    electronApi.listeners.onClickSaveAsFile = ()=> dispatch("onMenuSaveAs")
    electronApi.listeners.onClickPreferences = () => dispatch("onMenuPreferences")
    electronApi.listeners.onClickToggleView = ()=> dispatch("onToggleView")
  }
};




export default {
  namespaced,
  actions,
  getters
};
