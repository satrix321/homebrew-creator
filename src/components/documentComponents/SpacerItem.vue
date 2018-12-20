<template>
  <div class="spacer"></div>
</template>

<script>
export default {
  name: 'SpacerItem'
};
</script>

<style lang="scss" scoped>
.spacer {
  width: 21cm;
  height: 50px;
}

@media print {
  .spacer {
    display: none !important;
    height: 0 !important;
  }
}
</style>