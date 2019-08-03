<template>
  <div class="dropdown">
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
};
</script>

<style lang="scss" scoped>
.dropdown {
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
  }

  &:hover .dropdown__content {
    display: flex;
  }
}
</style>
