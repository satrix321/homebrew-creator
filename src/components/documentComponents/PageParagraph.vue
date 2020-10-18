<template>
  <p :class="classList" v-html="processedText"></p>
</template>

<script>
import { regexConsts } from '@/modules/globals';

export default {
  name: 'PageParagraph',
  props: {
    text: {
      type: String,
      required: true,
    },
    pageTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      classList: [ this.pageTheme ],
    };
  },
  computed: {
    processedText() {
      let output = this.text;
      output = output.replace(
        regexConsts.italicTextRegex,
        (fullMatch, group1, group2) => `${group1}<em>${group2}</em>`
      );
      output = output.replace(
        regexConsts.boldTextRegex,
        (fullMatch, group1, group2) => `${group1}<strong>${group2}</strong>`
      );
      output = output.replace(
        regexConsts.italicBoldTextRegex,
        (fullMatch, group1, group2) => `${group1}<strong><em>${group2}</em></strong>`
      );
      return output;
    },
  },
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
