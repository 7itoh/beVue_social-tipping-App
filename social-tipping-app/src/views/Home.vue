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
        <h2>User_Name {{ getMyName }}さん</h2>
      </div>
      <div class="column is-one-third">
        <h2>Wallet残高 {{ getMyWallet }}</h2>
      </div>
      <div>
        <button class="button is-one-third is-info" @click="signOut()">
          Logout
        </button>
      </div>
    </section>
    <br />
    <br />
    <section class="user-list-wrap">
      <h1 class="title">User List</h1>
      <br />
      <section>
        <template v-if="modal">
          <section id="overlay">
            <section id="content">
              <br />
              <section>
                <p>ユーザーネーム: {{ getShowUserName }}さん</p>
              </section>
              <hr />
              <section>
                <p>Wallet残高: {{ getShowUserWallet }}</p>
              </section>
              <br />
              <br />
              <section class="text-right">
                <button
                  type="button"
                  @click="offModal()"
                  class="button is-info"
                >
                  閉じる
                </button>
              </section>
            </section>
          </section>
        </template>
      </section>
      <br />
      <section class="columns is-centered">
        <table class="table">
          <thead>
            <th>ユーザーネーム</th>
            <th>財布をみる</th>
            <th>送金する</th>
          </thead>
          <tbody v-for="(user, userIndex) of getUsersData" :key="userIndex">
            <tr>
              <td>{{ user.name }}</td>
              <td>
                <button class="button is-primary" @click="dispOn(user)">
                  Wallet
                </button>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      modal: false,
    };
  },
  mounted() {
    this.setInitialUserData();
  },
  computed: {
    ...mapGetters({
      getMyName: 'getMyName',
      getMyWallet: 'getMyWallet',
      getUsersData: 'getUsersData',
      getShowUserName: 'getShowUserName',
      getShowUserWallet: 'getShowUserWallet',
    }),
  },
  methods: {
    ...mapActions({
      setInitialUserData: 'setInitialUserData',
      signOut: 'signOut',
      setShowUser: 'setShowUser',
    }),
    dispOn(showUserVal) {
      this.modal = !this.modal ? true : false;
      this.setShowUser(showUserVal);
    },
    offModal() {
      this.modal = !this.modal ? true : false;
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
#content {
  z-index: 2;
  width: 80%;
  padding: 1em;
  background: #fff;
}

#overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
