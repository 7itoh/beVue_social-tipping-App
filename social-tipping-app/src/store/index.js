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
    getShowUserId: state => state.otherUser.id,
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

    // 他ユーザーのIDと名前と財布の参照
    setShowUser({ commit }, showUserVal){
        commit('setChkUser', showUserVal);
    },

    setContruct( _, contruct){
        const senderUser = contruct.sender;
        const recverUser = contruct.recipient;
        const contructWallet = contruct.wallet;

        let contructId = {
            senderId: '',
            receverId: '',
        }

        const doneContruct = async () => {
            await firebase.firestore().collection('users').where('name', '==', senderUser).get().then((snapshot) => {
                snapshot.forEach(doc => {
                    contructId.senderId = doc.id;
                });
            })
            await firebase.firestore().collection('users').where('name', '==', recverUser).get().then((snapshot) => {
                snapshot.forEach(doc => {
                    contructId.receverId = doc.id;
                });
            })

            // Wallet送金者
            const senderRef = await firebase.firestore().collection('users').doc(contructId.senderId);
            // const senderRef = firebase.firestore().collection('users').doc('2Y2OtQOD5ltNMeQLhN0J');

            // Wallet入金者
            const recverRef = await firebase.firestore().collection('users').doc(contructId.receverId);
            // const recverRef = firebase.firestore().collection('users').doc('66povHxuO556HGx1vHQU');
    
            await firebase.firestore().runTransaction(async (t) => {
                await t.get(senderRef).then(senderDoc => {
                    if (!senderDoc.exists) {
                        throw "Document does not exist!";
                    }
                    const updateWallet = senderDoc.data().wallet - contructWallet;
                    if (updateWallet < senderDoc.data().wallet) {
                        t.update(senderRef, {
                            wallet: updateWallet,
                            updatedAt: new Date()
                        });
                    } else {
                        return Promise.reject("Sorry! updateWallet is too big.");
                    }
                }).catch((err) => {
                    console.error(err);
                });

                await t.get(recverRef).then(recverDoc => {
                    if (!recverDoc.exists) {
                        throw "Document does not exist!";
                    }
                    const recverWallet = recverDoc.data().wallet + contructWallet;
                    if (recverWallet > recverDoc.data().wallet) {
                        t.update(recverRef, { 
                            wallet: recverWallet,
                            updatedAt: new Date()
                        });
                    } else {
                        return Promise.reject("Sorry! recverWallet is too small.");
                    }
                }).catch((err) => {
                    console.error(err);
                });
            })
        }
        doneContruct();
    }

}

const store = new createStore({
    state,
    getters,
    mutations,
    actions,
})

export default store;