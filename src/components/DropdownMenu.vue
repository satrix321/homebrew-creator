<template>
  <div class="dropdown" ref="dropdown" :class="{ 
    'dropdown--is-clicked': isClicked, 
    'dropdown--aligned-to-right': alignToRight }" 
    @click="click"
  >
    <button-item class="dropdown__button" :width="width">
      <slot name="dropdown-button"></slot>
    </button-item>
    <div class="dropdown__content" :class="{ 'dropdown__content--align-to-right': alignToRight }">
      <slot name="dropdown-content"></slot>
    </div>
  </div>
</template>

<script>
import ButtonItem from '@/components/ButtonItem';

export default {
  name: 'DropdownMenu',
  components: {
    ButtonItem
  },
  props: ['width', 'alignToRight'],
  data: function () {
    return {
      isClicked: false,
    };
  },
  mounted: function () {
    window.addEventListener('click', this.checkClick);
    this.$on('dropdownClick', (vueComponent) => {
      for (let child of this.$children) {
        if (child != vueComponent && child.close) {
          child.close();
        }
      }
    });
    this.$on('dropdownItemClick', () => {
      this.isClicked = false;
      this.$parent.$emit('dropdownItemClick');
    });
  },
  beforeDestroy: function () {
    window.removeEventListener('click', this.checkClick);
  },
  methods: {
    close: function () {
      this.isClicked = false;
    },
    click: function (event) {
      this.isClicked = !this.isClicked;
      this.$parent.$emit('dropdownClick', this);
      event.stopPropagation();
    },
    checkClick: function (event) {
      if (event.target !== this.$el) {
        this.isClicked = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  
  > .dropdown__button {
    font-family: $site-font;
    font-size: 10pt;
    white-space: nowrap;
  }

  > .dropdown__content {
    display: none;
    position: absolute;
    background-color: $toolbar-background-color;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 10;
    top: 30px;
    overflow: visible;
    flex-direction: column;

    .dropdown {
      height: 30px;

      &:after {
        content: "\f054";
        font-family: 'Font Awesome 5 Free';
        font-weight: 900;
        font-size: 10pt;
        color: white;
        width: 20px;
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      > .dropdown__button {
        width: 100%;
        justify-content: left;
        height: 30px;
        border-top: 1px solid $toolbar-separator-color;
        padding-right: 30px;
      }

      > .dropdown__content {
        top: 0;
        left: 100%;
        border-left: 5px solid black;
      }
    }

    &.dropdown__content--align-to-right {
      right: 0;
    }
  }

  &.dropdown--aligned-to-right {
    > .dropdown__content .dropdown {
      &:after {
        display: none;
      }

      > .dropdown__button {
        padding-right: 0;
      }

      > .dropdown__content {
        left: initial;
        right: 100%;
        border-left: 0;
        border-right: 5px solid $toolbar-separator-color;
      }
    }
  }

  &:hover > .dropdown__content {
    display: flex;
  }

  @media screen and (max-width: $breakpoint) {
    &.dropdown--is-clicked > .dropdown__content {
      display: flex;
    }
  }
}
</style>
