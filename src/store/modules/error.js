import * as electronWrapper from "../../services/electronWrapper";

const namespaced = true;

const state = {
  value: {
    prepend: "",
    error: {
      message: "",
      code: "",
      details: "",
      name: "",
    },
  },
};

const getter ={
  getValue: (state) => state.value
}

const actions = {
  async electron({ commit }, { prepend = "", error = { message: "", code: null, details: "", name: "" } }) {
    await electronWrapper.showErrorBox(
      `${prepend ? prepend + " " : ""} ${error.message}\n\n${error.details ? "Details: " + error.details : ""}`
    );
    commit("setValue", {prepend: prepend, error: error});
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
