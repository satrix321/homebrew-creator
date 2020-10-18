<template>
  <div ref="loader" class="loader" :class="{'loader--is-visible': isLoaderVisible}">
    <i class="loader__icon fas fa-spinner fa-5x"></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TheLoader',
  computed: {
    ...mapGetters({
      isLoaderVisible: 'app/isLoaderVisible',
    })
  },
};
</script>

<style lang="scss" scoped>
.loader {
  display: none;
  position: fixed;
  z-index: 200;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);

  &.loader--is-visible {
    display: initial;
  }

  .loader__icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: $loader-color;

    animation-name: spin;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  }
}
</style>
