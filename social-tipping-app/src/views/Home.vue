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
        <h2>User_Name {{ myName }}さん</h2>
      </div>
      <div class="column is-one-third">
        <h2>Wallet残高 {{ myWallet }}</h2>
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

export default {
  name: 'Home',
  data() {
    return {
      myName: '',
      myWallet: '',
    };
  },
  async mounted() {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const setMyName = user.displayName;
        this.myName = setMyName;
        this.getMyWallet();
      }
    });
  },
  methods: {
    async getMyWallet() {
      let myWalletValue = [];
      let selectUser = await firebase.auth().currentUser.displayName;
      const querySnapshot = await firebase
        .firestore()
        .collection('users')
        .where('name', '==', selectUser)
        .get();
      await querySnapshot.forEach((getDoc) => {
        myWalletValue = (getDoc.id, ' => ', getDoc.data());
        this.myWallet = myWalletValue.wallet;
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
