import { createStore } from 'vuex'
import firebase from 'firebase'
import router from '../router/index'

const state = {
    setMyName: '',
    setMyWallet: '',
}
const getters = {
    setMyName: state => state.setMyName,
    setMyWallet: state => state.setMyWallet,
}
const mutations = {
    setInitialUserData(state, { newName, newWallet }) {
        state.setMyName = newName;
        state.setMyWallet = newWallet;
    }
}
const actions = {
    addSignUp( _, { userName, userEmail, userPasswd }) {
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

    addSignIn( _, { email, passwd }) {
        firebase.auth().signInWithEmailAndPassword(email, passwd)
                .then(res => {
                    res.user.getIdToken().then(idToken => {
                        localStorage.setItem('jwt', idToken);
                        router.push('/home').catch(err => {
                            console.log(err.message);
                    })
                })
            })
    },

    setInitialUserData({ commit }) { 
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                const setUserName = user.displayName;
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
            }
        });
    }

}

const store = new createStore({
    state,
    getters,
    mutations,
    actions,
})

export default store;