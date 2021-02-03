import { createStore } from 'vuex'

const state = {
    setMyName: '',
    setMyWallet: '',
}
const getters = {
    setMyName: state => state.setMyName,
    setMyWallet: state => state.setMyWallet,
}
const mutations = {
    setMyName(state, newName) { 
        state.setMyName = newName;
    },
    setMyWallet(state, newWallet) { 
        state.setMyWallet = newWallet;
    }

}
const actions = {
    setMyName({ commit }, newName) {
        commit('setMyName', newName);
    },
    setMyWallet({ commit }, newWallet) { 
        commit('setMyWallet', newWallet);
    }
}

const store = new createStore({
    state,
    getters,
    mutations,
    actions,
})

export default store;