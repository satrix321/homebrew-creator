<template>
  <button class="button" :class="{ 
    'button--float-right': floatRight, 
    'button--is-icon': isIcon,
    'button--is-clicked': isClicked,
    'button--is-dropdown-item': isDropdownItem
    }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>

export default {
  name: 'ButtonItem',
  props: {
    floatRight: { type: Boolean, required: false, default: false },
    isIcon: { type: Boolean, required: false, default: false },
    isClicked: { type: Boolean, required: false, default: false },
    isDropdownItem: { type: Boolean, required: false, default: false }
  },
};
</script>

<style lang="scss" scoped>
.button {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: $button-background-color;
  outline: none;
  font-family: $site-font-mono;
  font-size: 9pt;
  float: left;

  &:hover {
    background-color: $button-background-hover-color;
    cursor: pointer;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  &:active {
    background-color: $button-background-active-color;
  }

  &:disabled {
    color: $button-disabled-color;

    &:hover {
      background-color: $button-background-color;
    }
  }

  &.button--is-clicked {
    background-color: $button-background-clicked-color;

    &:hover {
      background-color: $button-background-hover-color;
    }
  }

  &.button--float-right {
    float: right;
  }

  &.button--is-icon {
    width: 30px;
    height: 30px;
  }

  &.button--is-dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
  }

  /deep/ svg {
    vertical-align: middle;
  }
}
</style>
