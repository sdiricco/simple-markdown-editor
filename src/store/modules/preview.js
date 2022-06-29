const namespaced = true;

const state = {
  value: '',
  valueRaw: ''
};

const getters = {
  getValue: (state) => state.value,
  getValueRaw: (state) => state.valueRaw,
  getIsSync: (state, _getters, _rootState, rootGetters) => rootGetters['editor/getValue'] === state.valueRaw,
};

const actions = {
  setValue({ commit }, value) {
    commit("setValue", value);
  },
  setValueRaw({commit}, value){
    commit("setValueRaw", value);
  }
};

const mutations = {
  setValue: (state, value) => (state.value = value),
  setValueRaw: (state, value) => (state.valueRaw = value),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
