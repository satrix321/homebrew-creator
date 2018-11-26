<template>
  <div ref="content">
  </div>
</template>

<script>
export default {
  name: 'PageHtml',
  props: {
    html: { type: String, required: true }
  },
  mounted: function () {
    this.$refs.content.innerHTML = this.html;
  }
};
</script>

<style lang="scss" scoped>
</style>
