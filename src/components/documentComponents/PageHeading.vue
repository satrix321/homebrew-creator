<template>
  <component :is="tag">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'PageHeading',
  props: {
    depth: {
      type: Number,
      required: true,
      validator: function (value) {
        return [1, 2, 3, 4, 5, 6].indexOf(value) !== -1;
      }
    },
    theme: { type: String, requried: true }
  },
  data () {
    return {
      tag: 'h' + this.depth
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
