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
  setValue({ commit }, value) {
    commit("setValue", value);
  },
  reload({commit, getters}){
    commit("setReloadCount", getters.getReload + 1)
  },
  setDefaults({ commit }){
    commit("setValue", "");
    commit("setReloadCount", 0);
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
