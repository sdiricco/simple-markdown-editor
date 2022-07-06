import * as validation from "../../services/validation";
import * as electronWrapper from "../../services/electronWrapper";



const namespaced = true;

const state = {};

const getters = {
  getFileHasChanged: (_state, _getters, _rootState, rootGetters) =>
    rootGetters["file/getValue"] !== rootGetters["editor/getValue"],
};

const actions = {
  async onDropFiles({ getters }, data) {
    const result = {
      canceled: false,
      filePath: null
    }
    if (getters.getFileHasChanged) {
      const { response } = await electronWrapper.showMessageQuestion(
        "The file has changed. Are you sure you want to open a new file without saving?"
      );
      if (response.cancel) {
        result.canceled = true;
        return result;
      }
    }
    const filePaths = Object.values(data.files).map((f) => f.path);
    await validation.validateFiles(filePaths);
    result.filePath = filePaths[0];
    return result
  },
  async onOpenFile({ getters }) {
    const result = {
      canceled: false,
      filePath: null
    }
    if (getters.getFileHasChanged) {
      const { response } = await electronWrapper.showMessageQuestion(
        "The file has changed. Are you sure you want to open a new file without saving?"
      );
      if (response.cancel) {
        result.canceled = true;
        return result;
      }
    }
    const { canceled, filePath } = await electronWrapper.showOpenDialog();
    if (canceled) {
      result.canceled = true
      return result;
    }
    await validation.validateFile(filePath);
    result.filePath = filePath;
    return result
  },
};

const mutations = {};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
