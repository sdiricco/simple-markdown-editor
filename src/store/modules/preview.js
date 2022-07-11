const namespaced = true;

const state = {
  value: '',
  valueRaw: '',
  toc: [],
};

const getters = {
  getValue: (state) => state.value,
  getValueRaw: (state) => state.valueRaw,
  getIsSync: (state, _getters, _rootState, rootGetters) => rootGetters['editor/getValue'] === state.valueRaw,
  getToc: (state) => state.toc,
};

const actions = {
  setValue({ commit }, value) {
    commit("setValue", value);
  },
  setValueRaw({commit}, value){
    commit("setValueRaw", value);
  },
  setToc({ commit }, value) {
    commit("setToc", value);
  }
};

const mutations = {
  setValue: (state, value) => (state.value = value),
  setValueRaw: (state, value) => (state.valueRaw = value),
  setToc: (state, value) => (state.toc = value),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
