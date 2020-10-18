<template>
  <hr :class="classList">
</template>

<script>
export default {
  name: 'PageThematicBreak',
  props: {
    pageTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      classList: [ this.pageTheme ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
