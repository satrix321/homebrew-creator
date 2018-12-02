<template>
  <div ref="content" :class="classList"/>
</template>

<script>
export default {
  name: 'PageNote',
  props: {
    noteType: { type: String, required: true },
    components: { type: Array, required: true },
    theme: { type: String, required: true },
    texturesEnabled: { type: Boolean, required: true }
  },
  data: function () {
    return {
      classList: [ this.noteType ]
    };
  },
  mounted: function () {
    for (let component of this.components) {
      this.$refs.content.appendChild(component.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
