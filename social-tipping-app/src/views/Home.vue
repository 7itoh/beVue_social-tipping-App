<template class="home">
  <article class="container">
    <section>
      <header class="title title-home">
        <h1>ユーザーホーム画面</h1>
      </header>
    </section>
    <br />
    <br />
    <section class="columns is-centered">
      <div class="column is-one-third">
        <h2>User_Name {{ setMyName }}さん</h2>
      </div>
      <div class="column is-one-third">
        <h2>Wallet残高 {{ setMyWallet }}</h2>
      </div>
      <div>
        <button class="button is-one-third is-info">Logout</button>
      </div>
    </section>
    <br />
    <br />
    <section class="user-list-wrap">
      <h1 class="title">User List</h1>
      <br />
      <br />
      <section class="columns is-centered">
        <table class="table">
          <thead>
            <th>ユーザーネーム</th>
            <th>財布をみる</th>
            <th>送金する</th>
          </thead>
          <tbody>
            <tr>
              <td>User_A</td>
              <td>
                <button class="button is-primary">Wallet</button>
              </td>
              <td>
                <button class="button is-danger">Sender</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <br />
      <br />
    </section>
  </article>
</template>
<script>
import firebase from 'firebase';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      myName: '',
      myWallet: '',
    };
  },
  mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('setMyName', user.displayName);
        this.getMyWallet(user);
      }
    });
  },
  computed: {
    ...mapGetters({
      setMyName: 'setMyName',
      setMyWallet: 'setMyWallet',
    }),
  },
  methods: {
    async getMyWallet(user) {
      let myValue = [];
      let selectUser = await user.displayName;
      const querySnapshot = await firebase
        .firestore()
        .collection('users')
        .where('name', '==', selectUser)
        .get();
      await querySnapshot.forEach((getDoc) => {
        myValue = (getDoc.id, ' => ', getDoc.data());
        this.$store.dispatch('setMyWallet', myValue.wallet);
      });
    },
  },
};
</script>
<style scoped>
th {
  padding-left: 20px;
}
td {
  padding-left: 20px;
  justify-content: center;
  text-align: center;
}
</style>
