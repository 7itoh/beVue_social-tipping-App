<template class="signup">
  <article class="container">
    <HeaderTitle class="title" title="新規ユーザー登録画面" />
    <br />
    <section class="columns is-centered">
      <form class="form">
        <section class="columns">
          <label class="column" for="user_name">ユーザーネーム</label>
          <InptText
            class="input column"
            name="user_name"
            id="set_user_name"
            placeholder="tarou"
            :value="inptUserName"
            @change="inptUserName = $event.target.value"
          />
        </section>
        <section class="columns">
          <label class="column" for="user_email">メールアドレス</label>
          <InptText
            class="input column"
            name="user_email"
            id="set_user_email"
            placeholder="taro@XXXXX.com"
            :value="inptEmail"
            @change="inptEmail = $event.target.value"
          />
        </section>
        <section class="columns">
          <label class="column" for="user_name">パスワード</label>
          <InptText
            class="input column"
            type="password"
            name="user_passwd"
            id="set_user_passwd"
            placeholder="password"
            :value="inptPasswd"
            @change="inptPasswd = $event.target.value"
          />
        </section>
      </form>
      <br />
    </section>
    <section>
      <Button
        class="button is-danger"
        action="新規登録"
        @click="signUp()"
        :disabled="IsValue()"
      />
    </section>
    <br />
    <section>
      <Link to="/signin" guideMsg="ログインページへ戻る" />
    </section>
    <br />
    <br />
  </article>
</template>
<script>
import { mapActions } from 'vuex';

import HeaderTitle from '../elements/BaseHeader';
import InptText from '../elements/BaseInptText';
import Button from '../elements/BaseButton';
import Link from '../elements/BaseLink';

export default {
  name: 'Signup',
  components: {
    HeaderTitle,
    InptText,
    Button,
    Link,
  },
  data() {
    return {
      inptUserName: '',
      inptEmail: '',
      inptPasswd: '',
    };
  },
  methods: {
    ...mapActions({
      addSignUp: 'addSignUp',
    }),
    signUp() {
      const commitCheck = window.confirm(
        `アカウント : ${this.inptUserName}のユーザーを登録しますがよろしいですか？`
      );
      if (commitCheck) {
        this.addSignUp({
          userName: this.inptUserName,
          userEmail: this.inptEmail,
          userPasswd: this.inptPasswd,
        });
      }
    },
    IsValue() {
      const inptTaskChk = /\S/g;
      return (
        !this.inptUserName ||
        !this.inptEmail ||
        !this.inptPasswd ||
        !inptTaskChk.test(this.inptUserName) ||
        !inptTaskChk.test(this.inptEmail) ||
        !inptTaskChk.test(this.inptPasswd)
      );
    },
  },
};
</script>
<style scoped>
section {
  padding-bottom: 12px;
}
.input {
  width: 300px;
}
</style>
