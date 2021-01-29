import firebase from 'firebase'
import ENV from '../authentication.json'

const config = {
    apiKey : ENV.FIREBASE_API_KEY,
    authDomain : ENV.FIREBASE_AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MSG_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
    measurementId: ENV.FIREBASE_MEASUREMENT_ID
}

if (!firebase.apps.length) { 
    firebase.initializeApp(config);
}

export default firebase