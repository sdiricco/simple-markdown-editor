import * as electronApi from "../../services/electronApi"
const namespaced = true;

const state = {
    html:"",
    editFile:{},
    error: false,
    errorMessage: ""
};

const getters = {
    getHtml: state => state.html,
    getEditFile: state => state.editFile,
    getError: state => state.error,
    getErrorMessage: state => state.errorMessage
};

const actions = {
    async markdownParse ({ commit }, data = {content: ''}) {
        const response = await electronApi.markdownParse(data.content)
        commit("setHtml", response.data);
    },
    async openFileFromDialog({commit}){

    }
};

const mutations = {
    setHtml: (state, data) => (state.html = data.html),
};

export default {
    namespaced,
    state,
    getters,
    actions,
    mutations,
};