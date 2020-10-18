<template>
  <div class="footer" :class="classList" :data-page="pageNumber">
    <div class="footer__background"/>
    <p class="footer__number">{{ pageNumber }}</p>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
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
      this.classList.push('footer--is-odd');
    } else {
      this.classList.push('footer--is-even');
    }
  },
};
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;

  .footer__number {
    position: absolute;
    font-family: 'headers';
    color: $page-footer-number-default-color;
    font-size: 12pt;
  }

  &.theme--default {
    .footer__background {
      position: absolute;
      width: 21cm;
      height: 1cm;
      bottom: 0;
      left: 0; 
      background-image: url('../../assets/images/footer_01.png');
      background-size: 21cm 1cm;
    }

    &.footer--is-even {
      .footer__background {
        transform: scaleX(-1);
      }
    }

    .footer__number {
      bottom: 0.2cm;
    }
    &.footer--is-odd {
      .footer__number {
        left: 20.3cm;
      }  
    }
    &.footer--is-even {
      .footer__number {
        left: 0.5cm;
      }  
    }
  }

  &.theme--cthulhu-1 {
    .footer__number {
      bottom: 0;
      margin-bottom: 10px;
      left: 10.5cm;
      -moz-transform: translate(-50%);
      -o-transform: translate(-50%);
      -webkit-transform: translate(-50%);
      transform: translate(-50%);
      color: $page-footer-number-cthulhu-1-color;
    }
  }

  &.theme--cthulhu-2 {
    .footer__number {
      bottom: 0.8cm;
      left: 10.5cm;
      -moz-transform: translate(-50%);
      -o-transform: translate(-50%);
      -webkit-transform: translate(-50%);
      transform: translate(-50%);
      color: $page-footer-number-cthulhu-2-color;
    }
  }
}
</style>
