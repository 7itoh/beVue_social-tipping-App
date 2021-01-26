<template class="button">
  <button>{{ action }}</button>
</template>
<script>
export default {
  name: 'Button',
  props: {
    action: String,
  },
};
</script>

<style scoped></style>
