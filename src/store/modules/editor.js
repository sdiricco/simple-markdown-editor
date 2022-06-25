const namespaced = true;

const state = {
    value: ''
};

const getters = {
  getValue: (state) => state.value,
};

const actions = {
  async setValue({ commit }, { value = "" }) {
    commit("setValue", value);
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
