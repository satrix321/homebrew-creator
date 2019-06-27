<template>
  <div class="break" :style="{ 'height': pageBreakHeight }"/>
</template>

<script>
export default {
  name: 'PageColumnBreak',
  props: {
    pageWorkAreaHeight: { type: Number, required: false, default: 0 },
    precedingComponents: { type: Array, required: false, default: undefined },
  },
  data: function () {
    return {
      pageBreakHeight: '',
    };
  },
  mounted: function () {
    window.requestAnimationFrame(this.calculateHeight);
  },
  methods: {
    calculateHeight: function () {
      if (this.pageWorkAreaHeight && this.precedingComponents) {
        let componentsHeight = 0;
        for (let component of this.precedingComponents) {
          let computedStyles = window.getComputedStyle(component.$el);
          componentsHeight += component.$el.offsetHeight + parseInt(computedStyles.marginTop) + parseInt(computedStyles.marginBottom);
        }
        this.pageBreakHeight = this.pageWorkAreaHeight - componentsHeight + 'px';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.break {
  break-after: column;
}
</style>
