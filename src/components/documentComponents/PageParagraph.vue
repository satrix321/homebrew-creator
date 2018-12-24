<template>
  <p :class="classList" v-html="processedText">
  </p>
</template>

<script>
export default {
  name: 'PageParagraph',
  props: {
    text: { type: String, required: true },
    pageTheme: { type: String, required: true }
  },
  data: function () {
    return {
      classList: [ this.pageTheme ]
    };
  },
  computed: {
    processedText: function () {
      let output = this.text;
      output = output.replace(/(?:(?!\*).|^)\*([^\s*].*?[^\s*]|[^\s*])\*(?!\*)/g, function (fullMatch, group1) {
        return '<em>' + group1 + '</em>';
      });
      output = output.replace(/(?:(?!\*).|^)\*\*([^\s*].*?[^\s*]|[^\s*])\*\*(?!\*)/g, function (fullMatch, group1) {
        return '<strong>' + group1 + '</strong>';
      });
      output = output.replace(/(?:(?!\*).|^)\*\*\*([^\s*].*?[^\s*]|[^\s*])\*\*\*(?!\*)/g, function (fullMatch, group1) {
        return '<strong><em>' + group1 + '</em></strong>';
      });
      return output;
    }
  }
};
</script>

<style lang="scss" scoped>
p {
  font-family: 'regular-text';
  font-size: 9pt;
  line-height: 1.25;
  text-align: justify;
  white-space: normal;
  margin-bottom: 10px;
}

.list-item,
.last {
  margin-bottom: 0;
}

</style>
