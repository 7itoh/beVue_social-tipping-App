import { createStore } from 'vuex'
import firebase from 'firebase'
import router from '../router/index'

const state = {
    idToken: '',
    myName: '',
    myWallet: '',
    usersData: [],
    otherUser: {
        name: '',
        wallet: '',
    },
}
const getters = {
    setIdToken: state => state.idToken,
    getMyName: state => state.myName,
    getMyWallet: state => state.myWallet,
    getUsersData: state => state.usersData,
    getShowUserName: state => state.otherUser.name,
    getShowUserWallet: state => state.otherUser.wallet,
}
const mutations = {
    setIdToken(state, newIdToken) {
        state.idToken = newIdToken ? true : false;
    },

    setInitialUserData(state, { newName, newWallet }) {
        state.myName = newName;
        state.myWallet = newWallet;
    },

    setUsersData(state, newUsersData) {
        state.usersData = newUsersData;
    },

    setChkUser(state, showUserVal) {
        state.otherUser.name = showUserVal.name;
        state.otherUser.wallet = showUserVal.wallet;
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

    addSignUp({ commit, dispatch }, { userName, userEmail, userPasswd }) {
        firebase
            .auth()
            .createUserWithEmailAndPassword(userEmail, userPasswd)
            .then((result) => {
                result.user.updateProfile({
                    displayName: userName,
                }).then(() => {
                    dispatch('setUserFirstData', result.user.displayName)
                        .then(() => { 
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

    // 認証後のユーザーデータ取得
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

    // 新規認証時のユーザー値の登録
    setUserFirstData(_, userName) {
        const initialWalletValue = 400;
        firebase
            .firestore()
            .collection('users')
            .add({
            name: userName,
            wallet: initialWalletValue,
            createdAt: new Date(),
            updatedAt: new Date(),
            })
    },
    
    // 他ユーザーの全件データ取得
    setUsersData({ commit }, userName){
        const usersList = [];
        firebase.firestore().collection('users').where('name', '!=', userName).get().then((snapshot) => {
            snapshot.forEach(doc => {
                usersList.push(doc.data());
            })
        });
        commit('setUsersData', usersList);
    },

    // 他ユーザーの名前と財布の参照
    setShowUser({ commit }, showUserVal){
        commit('setChkUser', showUserVal);
    },

    // ユーザーへの送金
    setContruct({ dispatch }, contruct) { 
        dispatch('updateRecipient', contruct);
        dispatch('updateSender', contruct);
    },

    // 入金者のWallet更新処理
    updateRecipient(_, contruct) { 
        const userName = contruct.recipient;
        const recvWallet = contruct.wallet;
        firebase.firestore().collection('users').where('name', '==', userName).get().then((snapshot) => { 
            snapshot.forEach(doc => { 
                const updateWalletVal = doc.data().wallet + recvWallet;
                const userRef = firebase.firestore().collection('users').doc(doc.id);
                userRef.update({
                    wallet: updateWalletVal,
                    updatedAt: new Date(),
                })
            })
        })
    },

    // 送金者のWallet更新処理
    updateSender(_, contruct) { 
        const userName = contruct.sender;
        const sendWallet = contruct.wallet;
        firebase.firestore().collection('users').where('name', '==', userName).get().then((snapshot) => { 
            snapshot.forEach(doc => { 
                const updateWalletVal = doc.data().wallet - sendWallet;
                const userRef = firebase.firestore().collection('users').doc(doc.id);
                userRef.update({
                    wallet: updateWalletVal,
                    updatedAt: new Date(),
                })
            })
        })

    },


}

const store = new createStore({
    state,
    getters,
    mutations,
    actions,
})

export default store;