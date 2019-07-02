<template>
  <button class="button" :class="{
    'button--is-icon': isIcon,
    'button--is-clicked': isClicked
    }" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>

export default {
  name: 'ButtonItem',
  props: {
    isIcon: { type: Boolean, required: false, default: false },
    isClicked: { type: Boolean, required: false, default: false }
  },
};
</script>

<style lang="scss" scoped>
.button {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: $button-color;
  background-color: $button-background-color;
  outline: none;
  font-family: $site-font-mono;
  font-size: 9pt;
  display: inline-flex;
  align-items: center;
  justify-content: center;

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

  &.button--is-icon {
    width: 30px;
    height: 30px;
  }

  /deep/ svg {
    vertical-align: middle;
  }
}
</style>
