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
  background-color: $btn-backgroundColor;
  outline: none;
  font-family: $site-monoFont;
  font-size: 9pt;
  display: block;
  width: 100%;
  text-align: left;

  &:hover {
    background-color: $btn-backgroundColorHover;
    cursor: pointer;
  }

  &::-moz-focus-inner {
    border: 0;
  }

  &:active {
    background-color: $btn-backgroundColorActive;
  }

  &:disabled {
    color: $btn-colorDisabled;

    &:hover {
      background-color: $btn-backgroundColor;
    }
  }

  &.dropdown-item--is-clicked {
    background-color: $btn-backgroundColorClicked;

    &:hover {
      background-color: $btn-backgroundColorHover;
    }
  }

  /deep/ svg {
    vertical-align: middle;
  }
}
</style>
