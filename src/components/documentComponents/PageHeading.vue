<template>
  <component :is="tag" class="heading" :class="classList">
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
    pageTheme: { type: String, requried: true },
    isTitlePage: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      tag: 'h' + this.depth,
      classList: [ this.pageTheme ]
    };
  },
  created: function () {
    if (this.isTitlePage) {
      this.classList.push('heading--is-title');
    }
  }
};
</script>

<style lang="scss" scoped>
h1, h2, h3, h4, h5, h6 {
  font-family: 'headers';
  text-transform: uppercase;
  color: $page-heading-default-color;
  margin-bottom: 15px;

  &.theme--cthulhu-1 {
    margin-bottom: 5px;
  }

  &.heading--is-title {
    text-align: center;
    font-family: 'titlePage';
    color: $page-heading-title-default-color;
    text-shadow: -2.5px 0 black, 0 2.5px black, 2.5px 0 black, 0 -2.5px black;
  }
}

h1, h2, h3 {
  &::first-letter {
    font-size: 120%;
  }
  &.theme--cthulhu-1 {
    &::first-letter {
      font-size: 100%;
    }
  }
}

h3, h4, h5, h6 {
  &.theme--cthulhu-1 {
    text-transform: initial;
  }
}

h1 {
  font-size: 21pt;

  &.theme--cthulhu-1 {
    font-size: 24pt;
  }

  &.heading--is-title {
    font-size: 70pt;
  }
}

h2 {
  font-size: 18pt;

  &.theme--cthulhu-1 {
    font-size: 18pt;
  }

  &.heading--is-title {
    font-size: 50pt;
  }
}

h3 {
  font-size: 16pt;
  border-bottom: 1px solid $page-heading-border-default-color;

  &.theme--cthulhu-1 {
    font-size: 14pt;
    border-bottom: none;
  }

  &.heading--is-title {
    font-size: 35pt;
  }
}

h4 {
  &.heading--is-title {
    font-size: 24pt;
  }
}

h5 {
  &.heading--is-title {
    font-size: 18pt;
  }
}

h6 {
  &.heading--is-title {
    font-size: 16pt;
  }
}
</style>
