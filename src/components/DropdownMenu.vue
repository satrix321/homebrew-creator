<template>
  <div class="dropdown" :class="{ 'dropdown--float-right': floatRight }">
    <button-item class="dropdown__button">
      <slot name="dropdown-button"></slot>
    </button-item>
    <div class="dropdown__content">
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
  props: {
    floatRight: { type: Boolean, required: false, default: false },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  float: left;
  
  &.dropdown--float-right {
    float: right;
  }

  .dropdown__content {
    display: none;
    position: absolute;
    background-color: $toolbar-backgroundColor;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 10;
    top: 30px;
    float: none;
    overflow: visible;
  }

  &:hover .dropdown__content {
    display: block;
  }
}
</style>
