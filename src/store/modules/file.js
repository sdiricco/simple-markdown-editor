import * as nodeApi from "../../services/nodeApi";

const namespaced = true;

const state = {
  name: "",
  value: "",
  ext: "",
  path: "",
  stat: {},
};

const getters = {
  getName: (state) => state.name,
  getValue: (state) => state.value,
  getExt: (state) => state.ext,
  getPath: (state) => state.path,
  getStat: (state) => state.stat,
};

const actions = {
  async read({ commit }, { filePath = null }) {
    try {
      console.log("STORE > ACTIONS > readFile");
      const { file } = await nodeApi.readFile(filePath);
      commit("setFile", file);
      return file;
    } catch (e) {
      console.log("error in actions.readFile", e.message);
      throw e;
    }
  },

  async save({ dispatch }, { filePath = null, value = null }) {
    try {
      console.log("STORE > ACTIONS > saveFile");
      await nodeApi.saveFile({ filePath: filePath, value: value });
      await dispatch("readFile", { filePath: filePath });
    } catch (e) {
      console.log("Error in actions.saveFile", e.message);
      throw e;
    }
  },
};

const mutations = {
  setFile: (state, { name, value, ext, path, stat }) => (
    (state.name = name),
    (state.value = value),
    (state.ext = ext),
    (state.path = path),
    (state.stat = stat)
  ),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
