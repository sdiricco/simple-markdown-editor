import * as electronApi from "../../services/electronApi";
import * as electronWrapper from "../../services/electronWrapper";
import * as validation from "../../services/validation";
import path from "path";

const namespaced = true;

const getters = {
  getFileHasChanged: (_state, _getters, _rootState, rootGetters) =>
    rootGetters["main/getFile"].value !== rootGetters["editor/getFile"].value,
};

const actions = {
  /* On Click: Menu > File > Save */
  async onMenuSave({ dispatch, rootGetters }) {
    const filePath = rootGetters["file/getPath"];
    const editorValue = rootGetters["editor/getValue"];

    if (filePath === "") {
      await dispatch("handleOnMenuSaveAs");
      return;
    }
    await dispatch("file/save", { path: filePath, content: editorValue }, { root: true });
  },

  /* On Click: Menu > File > Save as */
  async onMenuSaveAs({ dispatch, rootGetters }) {
    const editorValue = rootGetters["editor/getValue"];

    const { canceled, filePath } = await electronWrapper.showSaveDialog();
    if (canceled) {
      return;
    }
    await dispatch("file/save", { filePath: filePath, value: editorValue }, { root: true });
  },

  //On Click: Menu > File > Open
  async onMenuOpen({ dispatch, getters }) {
    try {
      //if file has changed, show message info.
      //1 - if user click on cancel, siply return
      //2 - if user click on ok, continue choosing file from open dialog
      if (getters.getFileHasChanged) {
        const { canceled } = await electronWrapper.showMessageQuestion(
          "The file has changed. Are you sure you want to open a new file without saving?"
        );
        if (canceled) {
          return;
        }
      }
      //chose a file from open dialog
      //1 - if canceled, simply return
      //2 - if choosing a file, return the path
      const { canceled, filePath } = await electronWrapper.showOpenDialog();
      if (canceled) {
        return;
      }

      await validation.validateFile(filePath);

      await dispatch('loadFile', {filePath: filePath})
    } catch (e) {
      await electronWrapper.showErrorBox(
        `Error during opening file: ${e.message}\n\n${e.details ? "Details: " + e.details : ""}`
      );
    }
  },



  //On Drop files
  async onDropFiles({ dispatch }, data = { files: [] }) {
    try {
      const filePaths = Object.values(data.files).map((f) => f.path);
      console.log("files", filePaths);
      await validation.validateFiles(filePaths);

      await dispatch('loadFile', {filePath: filePaths[0]})
    } catch (e) {
      console.log(e.message);
      console.log(e.details);
      await electronWrapper.showErrorBox(
        `Error during the drop files: ${e.message}\n\n${e.details ? "Details: " + e.details : ""}`
      );
    }
  },

  async onInit({ dispatch }) {
    try {
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
    } catch (e) {
      console.log(e.message);
      console.log(e.details);
      throw e;
    }
  },


  loadFile({dispatch}, {filePath = ''}){
    const { value } = await dispatch("file/read", { filePath: filePath }, { root: true });
    await dispatch("editor/setValue", { value: value }, { root: true });
    await dispatch("markdown/parse", {}, {root:true});
  },
};

export default {
  namespaced,
  actions,
};
