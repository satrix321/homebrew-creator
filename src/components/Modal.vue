<template>
  <div class="modal">
    <div class="modalContent">
      <div class="modalHeader">
        <span class="close">&times;</span>
        <h2>Modal Header</h2>
      </div>
      <div class="modalBody">
        <p>Some text in the Modal Body</p>
        <p>Some other text...</p>
      </div>
      <div class="modalFooter">
        <h3>Modal Footer</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal'
};
</script>

<style lang="scss">
.modal {
  // display: none;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);

  .modalContent {
    position: relative;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 0;
    border: 1px solid #888;
    width: 80%;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;

    @keyframes animatetop {
      from {top: -300px; opacity: 0}
      to {top: 0; opacity: 1}
    }

    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;

      &:hover,
      &:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }
    }

    .modalHeader {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }

    .modalBody {
      padding: 2px 16px;
    }

    .modalFooter {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }

  }
}
</style>