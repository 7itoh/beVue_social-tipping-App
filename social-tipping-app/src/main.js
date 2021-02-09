import { createApp } from 'vue'
import App from './App.vue'
import router from '../src/router/index'
import store from '../src/store/index'
import Firebase from '../src/firebase/index'

const firebase = Firebase.init();

const app = createApp(App);
app.use(router);
app.use(store);
app.use(firebase);
app.mount('#app');
