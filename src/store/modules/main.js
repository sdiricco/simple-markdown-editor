const namespaced = true;
import * as _ from "lodash"

const state = {
  tabs: {
    editor: "tab-editor",
    preview: "tab-preview",
  },
  dropZone: false,
  currentTab: "tab-editor",
};

const getters = {
  getDropZone: (state) => state.dropZone,
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

const throttledDropZone = _.throttle((value)=>{
  mutations.setDropZone(state, value)
}, 200, {leading:true});

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
  async disableDropZone(){
    throttledDropZone(false);
  },
  async enableDropZone(){
    throttledDropZone(true);
  },
  enableDropZoneOnDrag({commit}){
    document.body.addEventListener('dragenter', ()=>{
      commit("setDropZone", true)
    })
  },

};

const mutations = {
  setCurrentTab: (state, value) => (state.currentTab = value),
  setDropZone: (state, value) => (state.dropZone = value)
};

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};
