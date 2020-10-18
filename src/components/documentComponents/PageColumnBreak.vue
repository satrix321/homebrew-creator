<template>
  <div :style="{ 'height': pageBreakHeight }"/>
</template>

<script>
export default {
  name: 'PageColumnBreak',
  props: {
    pageWorkAreaHeight: {
      type: Number,
      required: false,
      default: 0,
    },
    precedingComponents: {
      type: Array,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      pageBreakHeight: '',
    };
  },
  mounted() {
    window.requestAnimationFrame(this.calculateHeight);
  },
  methods: {
    calculateHeight() {
      if (this.pageWorkAreaHeight && this.precedingComponents) {
        let componentsHeight = 0;

        for (const component of this.precedingComponents) {
          const computedStyles = window.getComputedStyle(component.$el);
          componentsHeight += component.$el.offsetHeight + parseInt(computedStyles.marginTop) + parseInt(computedStyles.marginBottom);
        }

        this.pageBreakHeight = (this.pageWorkAreaHeight - componentsHeight) + 'px';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
