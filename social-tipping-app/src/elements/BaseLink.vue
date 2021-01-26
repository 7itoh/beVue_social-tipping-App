<template class="page-link">
  <router-link :to="to">{{ guideMsg }}</router-link>
</template>

<script>
export default {
  name: 'PageLink',
  props: {
    to: String,
    guideMsg: String,
  },
};
</script>

<style scoped></style>
