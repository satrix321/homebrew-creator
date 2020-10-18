<template>
  <div class="header" :class="classList">
    <div class="header__background"></div>
    <p class="header__number"></p>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    pageNumber: {
      type: Number,
      required: true,
    }, 
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
  created() {
    if (this.pageNumber % 2 === 1) {
      this.classList.push('header--is-odd');
    } else {
      this.classList.push('header--is-even');
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  .header__background {
    position: absolute;
    width: 100%;
  }

  .header__number {
    margin: 0;
  }

  &.theme--cthulhu-1 {
    .header__background {
      background-image: url('../../assets/images/header_cthulhu_01.png');
      background-repeat: no-repeat;
      height: 10px;
      top: 40px;
    }

    &.header--is-even .header__background {
      transform: scaleX(-1);
    }
  }
}
</style>
