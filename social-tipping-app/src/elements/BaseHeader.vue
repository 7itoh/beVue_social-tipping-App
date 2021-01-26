<template class="header-title">
  <header>
    <h1>{{ title }}</h1>
  </header>
</template>

<script>
export default {
  name: 'HeaderTitle',
  props: {
    title: String,
  },
};
</script>

<style scoped></style>
