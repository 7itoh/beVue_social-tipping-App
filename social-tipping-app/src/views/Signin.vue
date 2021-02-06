<template class="signin">
  <article class="container">
    <HeaderTitle class="title is-small" title="ユーザーログイン画面" />
    <br />
    <section class="columns is-centered">
      <form class="form">
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
          <label class="column" for="user_passwd">パスワード</label>
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
        class="button is-info"
        action="ログイン"
        @click="signIn()"
        :disabled="IsValue()"
      />
    </section>
    <br />
    <section>
      <Link to="/signup" guideMsg="新規登録はこちらから" />
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
  name: 'Signin',
  components: {
    HeaderTitle,
    InptText,
    Button,
    Link,
  },
  data() {
    return {
      inptEmail: '',
      inptPasswd: '',
    };
  },
  methods: {
    ...mapActions({
      addSignIn: 'addSignIn',
    }),
    signIn() {
      this.addSignIn({ email: this.inptEmail, passwd: this.inptPasswd });
    },
    IsValue() {
      const inptTaskChk = /\S/g;
      return (
        !this.inptEmail ||
        !this.inptPasswd ||
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
