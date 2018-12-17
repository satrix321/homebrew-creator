<template>
  <hr :class="classList">
</template>

<script>
export default {
  name: 'PageThematicBreak',
  props: {
    theme: { type: String, required: true }
  },
  data: function () {
    return {
      classList: []
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
