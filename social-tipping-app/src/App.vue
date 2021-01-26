<template id="app">
  <article>
    <router-view></router-view>
    <FooterTitle title="Copyright 2021" />
  </article>
</template>

<script>
import FooterTitle from './elements/BaseFooter';

export default {
  name: 'App',
  components: {
    FooterTitle,
  },
};
</script>

<style lang="scss">
@import '../node_modules/bulma/bulma.sass';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  justify-content: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
