const namespaced = true;

const state = {
  tabs: {
    editor: "tab-editor",
    preview: "tab-preview",
  },
  currentTab: "tab-editor",
};

const getters = {
  getCurrentTab: (state) => state.currentTab,
  getTabs: (state) => state.tabs,
  getTitle: (_state, _getters, _rootState, rootGetters) => {
    let title = 'Marktext';
    if (rootGetters["file/getPath"]) {
      title = `${rootGetters["handler/getFileHasChanged"] ? "M - " : ""}${rootGetters["file/getPath"]} - Marktext`;
    }
    return title;
  },
};

const actions = {
  toggleView({ commit, getters }) {
    const tabs = Object.values(getters.getTabs);
    let idx = tabs.indexOf(getters.getCurrentTab);
    idx = idx >= tabs.length - 1 ? 0 : idx + 1;
    commit("setCurrentTab", tabs[idx]);
  },
  setCurrentTab({ commit }, value) {
    commit("setCurrentTab", value);
  },
};

const mutations = {
  setCurrentTab: (state, value) => (state.currentTab = value),
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
