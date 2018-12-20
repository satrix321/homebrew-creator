<template>
  <div class="header header--is-textured" :class="classList">
    <div class="header__background"></div>
    <p class="header__number"></p>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    pageNumber: { type: Number, required: true }, 
    pageTheme: { type: String, required: true }
  },
  data: function () {
    return {
      classList: [ this.pageTheme ]
    };
  },
  created: function () {
    if (this.pageNumber % 2 === 1) {
      this.classList.push('header--is-odd');
    } else {
      this.classList.push('header--is-even');
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
