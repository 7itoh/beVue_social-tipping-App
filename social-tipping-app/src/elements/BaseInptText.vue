<template class="input-text">
  <input
    type="text"
    :name="name"
    :id="id"
    :value="value"
    :placeholder="placeholder"
    @change="setInptTxt"
  />
</template>
<script>
export default {
  name: 'InptText',
  props: {
    action: String,
    name: String,
    id: String,
    value: String,
    placeholder: String,
  },
  methods: {
    setInptTxt(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style scoped></style>
