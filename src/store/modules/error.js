import * as electronWrapper from "../../services/electronWrapper";

const namespaced = true;

const state = {
  value: {
    message: "",
    error: {
      message: "",
      code: "",
      details: "",
      name: "",
    },
  },
};

const getters ={
  getValue: (state) => state.value
}

const actions = {
  async electron({ commit }, { message = "", error = { message: null, code: null, details: null, name: null } }) {
    await electronWrapper.showErrorBox(
      `${message ? message : ""}${error.message ? "\nDetails: " + error.message : ""}`
    );
    commit("setValue", {message: message, error: error});
  },
};

const mutations = {
  setValue: (state, value) => (state.value = value),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
