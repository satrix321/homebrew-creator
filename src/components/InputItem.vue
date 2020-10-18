<template>
  <input class="input" v-model="value">
</template>

<script>
export default {
  name: 'InputItem',
  data() {
    return {
      value: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.input {
  border: none;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 5px;
  height: 30px;
}
</style>
