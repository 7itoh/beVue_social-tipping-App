import firebase from 'firebase'
import ENV from '../authentication.json'
import router from '../router/index';
import store from '../store/index';

const config = {
    apiKey : ENV.FIREBASE_API_KEY,
    authDomain : ENV.FIREBASE_AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MSG_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
    measurementId: ENV.FIREBASE_MEASUREMENT_ID
}

export default {
    init() {
        if (!firebase.apps.length) { 
            firebase.initializeApp(config);
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
    },

    siginInWithEmailAndPassword(email, password) { 
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                res.user.getIdToken().then(idToken => {
                    localStorage.setItem('jwt', idToken);
                    router.push('/home').catch(err => {
                        console.log(err.message);
                })
            })
        })
    },

    signUpWithEmailAndPassword(name, email, password) {
        const userName = name;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => {
                result.user.updateProfile({
                    displayName: userName,
                }).then(() => { 
                    store.dispatch('setMyName', result.user.displayName)
                }).then(() => {
                    this.setFirstUserData(result.user.displayName);
                }).catch(error => { 
                    alert(error.message);
                })
            })
            .then(() => {
                router.push('/home');
            })
            .catch((error) => {
                alert(error.message);
            });
    },

    async setFirstUserData(displayName) {
      await firebase
        .firestore()
        .collection('users')
        .add({
          name: displayName,
          wallet: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).then(() => {
            const walletValue = 400;
            store.dispatch('setMyWallet', walletValue);
         }).catch(err => { 
            console.log(err.message);
        });
    },
}