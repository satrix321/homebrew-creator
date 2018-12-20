<template>
  <div ref="modal" class="modal">
    <div class="modal__content">
      <div class="modal__header">
        <slot name="modal-header"></slot>
      </div>
      <div class="modal__body">
        <slot name="modal-content"></slot>
      </div>
      <div class="modal__footer">
        <slot name="modal-footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ModalItem',
  methods: {
    show: function () {
      this.$refs.modal.classList.add('modal--is-visible');
    },
    hide: function () {
      this.$refs.modal.classList.remove('modal--is-visible');
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  display: none;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  font-family: $site-font-mono;
  animation-name: modalshow;
  animation-duration: 0.4s;

  @keyframes modalshow {
    from {opacity: 0}
    to {opacity: 1}
  }

  &.modal--is-visible {
    display: initial;
  }

  .modal__content {
    position: fixed;
    padding: 0;
    border: 0;
    width: 900px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @keyframes animatetop {
      from {top: 0px; opacity: 0}
      to {top: 50%; opacity: 1}
    }

    .modal__header {
      padding: 2px 16px;
      background-color: $toolbar-background-color;
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal__body {
      padding: 10px;
      background-color: #2a2a2a;
      color: white;
    }

    .modal__footer {
      padding: 10px;
      background-color: $toolbar-background-color;
      color: white;

      &::after {
        content: " ";
        display: block; 
        height: 0; 
        clear: both;
      }
    }
  }
}
</style>
