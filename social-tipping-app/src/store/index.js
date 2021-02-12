import { createStore } from 'vuex'
import firebase from 'firebase'
import router from '../router/index'

const state = {
    idToken: '',
    setMyName: '',
    setMyWallet: '',
    usersData: [],
    checkUserName: '',
    checkUserWallet: '',
}
const getters = {
    setIdToken: state => state.idToken,
    getMyName: state => state.setMyName,
    getMyWallet: state => state.setMyWallet,
    getUsersData: state => state.usersData,
    getChkUserName: state => state.checkUserName,
    getChkUserWallet: state => state.checkUserWallet,
}
const mutations = {
    setIdToken(state, newIdToken) {
        state.idToken = newIdToken ? true : false;
    },

    setInitialUserData(state, { newName, newWallet }) {
        state.setMyName = newName;
        state.setMyWallet = newWallet;
    },

    setUsersData(state, newUsersData) {
        state.usersData = newUsersData;
    },

    setChkUserWallet(state, chkUserVal) {
        state.checkUserName = chkUserVal.name;
        state.checkUserWallet = chkUserVal.wallet;
    },
}
const actions = {
    initialIdToken({ commit }) { 
        const idToken = localStorage.getItem('jwt', idToken);
        if (!idToken) {
            return;
        } else { 
            commit('setIdToken', idToken);
        }
    },

    addSignUp({ commit }, { userName, userEmail, userPasswd }) {
        const initialWalletValue = 400;
        firebase
            .auth()
            .createUserWithEmailAndPassword(userEmail, userPasswd)
            .then((result) => {
                result.user.updateProfile({
                    displayName: userName,
                }).then(() => {
                    firebase
                        .firestore()
                        .collection('users')
                        .add({
                        name: result.user.displayName,
                        wallet: initialWalletValue,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        }).then(() => { 
                            result.user.getIdToken().then(idToken => { 
                                localStorage.setItem('jwt', idToken);
                                commit('setIdToken', idToken);
                            })
                        }).then(() => { 
                            router.push('/home');
                        }).catch(error => {
                        console.log(error.message);
                    })
                })
            })
            .catch((error) => {
              alert(error.message);
            })
    },

    addSignIn({ commit }, { email, passwd }) {
        firebase.auth().signInWithEmailAndPassword(email, passwd)
            .then(result => { 
                result.user.getIdToken()
                    .then( idToken => { 
                        localStorage.setItem('jwt', idToken);
                        commit('setIdToken', idToken);
                    }).then(() => { 
                        router.push('/home');
                    }).catch(error => { 
                        console.log(error.message);
                    })
            })
    },

    setInitialUserData({ commit, dispatch }) { 
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const setUserName = user.displayName;
                dispatch('setUsersData', setUserName).then(() => {
                    firebase
                        .firestore()
                        .collection('users')
                        .where('name', '==', setUserName)
                        .get()
                        .then((querySnapshot) => { 
                            querySnapshot.forEach(doc => { 
                                const myWalletValue = (doc.id, ' => ', doc.data());
                                commit('setInitialUserData', { newName: setUserName, newWallet: myWalletValue.wallet })
                            })
                        })
                        .catch(error => { 
                                console.log(error.message);
                        })
                }).catch(error => {
                    console.log(error.message);
                })
            }
        });
    },

    signOut({ commit }) {
        firebase.auth().signOut().then(() => { 
            localStorage.removeItem('jwt')
            const removeIdToken = null;
            commit('setIdToken', removeIdToken);
        }).then(() => { 
            router.push('/');
        }).catch(error => { 
            console.log(error.message);
        })
    },

    setUsersData({ commit }, userName){
        const usersList = [];
        firebase.firestore().collection('users').where('name', '!=', userName).get().then((snapshot) => {
            snapshot.forEach(doc => {
                usersList.push(doc.data());
            })
        });
        console.log(usersList);
        commit('setUsersData', usersList);
    },

    setChkUserWallet({ commit }, chkUserVal){
        commit('setChkUserWallet', chkUserVal);
    }
}

const store = new createStore({
    state,
    getters,
    mutations,
    actions,
})

export default store;