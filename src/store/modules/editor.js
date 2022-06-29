const namespaced = true;

const state = {
  value: "",
  reloadCount: 0
};

const getters = {
  getValue: (state) => state.value,
  getReload: (state) => state.reloadCount
};

const actions = {
  async setValue({ commit }, value) {
    commit("setValue", value);
  },
  async reload({commit, getters}){
    commit("setReloadCount", getters.getReload + 1)
  }
};

const mutations = {
  setValue: (state, value) => (state.value = value),
  setReloadCount: (state, value) => (state.reloadCount = value)
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
