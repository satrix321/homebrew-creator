<template>
  <button class="dropdown-item" :class="{ 
    'dropdown-item--is-clicked': isClicked,
    }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>

export default {
  name: 'ButtonItem',
  props: {
    isClicked: { type: Boolean, required: false, default: false },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: $button-background-color;
  outline: none;
  font-family: $site-font-mono;
  font-size: 9pt;
  display: block;
  width: 100%;
  text-align: left;

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

  &.dropdown-item--is-clicked {
    background-color: $button-background-clicked-color;

    &:hover {
      background-color: $button-background-hover-color;
    }
  }

  /deep/ svg {
    vertical-align: middle;
  }
}
</style>
