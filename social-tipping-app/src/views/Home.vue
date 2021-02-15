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
        <template v-if="showWalletmodal">
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
                  @click="offShowWalletmodal()"
                  class="button is-info"
                >
                  閉じる
                </button>
              </section>
            </section>
          </section>
        </template>
      </section>
      <section>
        <template v-if="sendWalletmodal">
          <section id="overlay">
            <section id="content">
              <br />
              <section>
                <p>{{ getMyName }}さん Wallet残高:{{ getMyWallet }}</p>
              </section>
              <hr />
              <section>
                <label>送金額: </label>
                <input type="text" v-model.number="sendWalletVal" />
                <button
                  class="button is-danger"
                  @click="addContruct(otherUser)"
                  :disabled="IsValue()"
                >
                  送金
                </button>
              </section>
              <br />
              <br />
              <section class="text-right">
                <button
                  type="button"
                  @click="offSendWalletmodal()"
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
                <button
                  class="button is-primary"
                  @click="dispShowWalletOn(user)"
                >
                  Wallet
                </button>
              </td>
              <td>
                <button
                  class="button is-danger"
                  @click="dispSendWalletOn(user)"
                >
                  Sender
                </button>
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
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      showWalletmodal: false,
      sendWalletmodal: false,
      sendWalletVal: '',
    };
  },
  mounted() {
    this.setInitialUserData();
  },
  computed: {
    ...mapState({
      otherUser: 'otherUser',
    }),
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
      setContruct: 'setContruct',
    }),
    addContruct(user) {
      const commitCheck = window.confirm(
        `アカウント : ${user.name}へ、Wallet:『${this.sendWalletVal}』を送金しますがよろしいですか？`
      );
      if (commitCheck) {
        const contruct = {
          sender: this.getMyName,
          wallet: this.sendWalletVal,
          recipient: user.name,
        };
        this.setContruct(contruct);
        setTimeout(() => {
          this.setInitialUserData();
          this.sendWalletVal = '';
          this.offSendWalletmodal();
        }, 2500);
      }
    },
    dispShowWalletOn(showUserVal) {
      this.showWalletmodal = !this.showWalletmodal ? true : false;
      this.setShowUser(showUserVal);
    },
    offShowWalletmodal() {
      this.showWalletmodal = !this.showWalletmodal ? true : false;
    },
    dispSendWalletOn(showUserVal) {
      this.sendWalletmodal = !this.sendWalletmodal ? true : false;
      this.setShowUser(showUserVal);
    },
    offSendWalletmodal() {
      this.sendWalletmodal = !this.sendWalletmodal ? true : false;
    },
    IsValue() {
      const inptTaskChk = /^[0-9]+$/;
      return (
        !this.sendWalletVal ||
        !inptTaskChk.test(this.sendWalletVal) ||
        this.sendWalletVal > this.getMyWallet
      );
    },
  },
};
</script>
<style scoped>
button {
  margin-left: 10px;
}
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
