<template>
  <div class="dropdown" ref="dropdown" @click="toggle">
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
  methods: {
    toggle: function (event) {
      this.$refs.dropdown.classList.toggle('dropdown--is-clicked');
      event.stopPropagation();
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  
  .dropdown__button {
    font-family: $site-font;
    font-size: 10pt;
    white-space: nowrap;
  }

  .dropdown__content {
    display: none;
    position: absolute;
    background-color: $toolbar-background-color;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 10;
    top: 30px;
    overflow: visible;
    flex-direction: column;

    &.dropdown__content--align-to-right {
      right: 0;
    }
  }

  &:hover .dropdown__content {
    display: flex;
  }

  @media screen and (max-width: $breakpoint) {
    &.dropdown--is-clicked .dropdown__content {
      display: flex;
    }
  }
}
</style>
