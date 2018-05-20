<style lang="scss" scoped>
@import "@/assets/scss/toolbar.scss";
</style>

<template>
  <div class="toolbar">
    <div class="dropdown">
      <button class="btn"><icon name="sticky-note"></icon> Notes</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertGreenNote"><icon style="color: rgb(218, 230, 191);" name="sticky-note"></icon> Green</button>
        <button class="btn" @click="insertBrownNote"><icon style="color: rgb(220, 207, 172);" name="sticky-note"></icon> Brown</button>
        <button class="btn" @click="insertPurpleNote"><icon style="color: rgb(231, 227, 239);" name="sticky-note"></icon> Purple</button>
        <button class="btn" @click="insertNewspaperNote"><icon style="color: rgb(244, 244, 226)" name="sticky-note"></icon> Newspaper</button>
        <button class="btn" @click="insertHandwrittenNote"><icon style="color: rgb(244, 244, 236)" name="sticky-note"></icon> Handwritten</button>
        <button class="btn" @click="insertPhbNote"><icon name="sticky-note"></icon> PHB</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="table"></icon> Tables</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertCocMonsterTable"><icon name="table"></icon> CoC - Monster Table</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="file"></icon> Pages</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertRegularPage"><icon name="file"></icon> Regular Page</button>
        <button class="btn" @click="insertColumnsPage"><icon name="file"></icon> Columns Page</button>
        <button class="btn" @click="insertTitlePage"><icon name="file"></icon> Title Page</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="image"></icon> Images</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertRelativeImage"><icon name="image"></icon> Relative Image</button>
        <button class="btn" @click="insertAbsoluteImage"><icon name="image"></icon> Absolute Image</button>
        <button class="btn" @click="insertFullPageImage"><icon name="file-image-o"></icon> Full Page Image</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="random"></icon> Misc</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertColumnBreak"><icon name="columns"></icon> Column Break</button>
        <button class="btn" @click="insertWideBlock"><icon name="arrows-h"></icon> Wide Block</button>
        <button class="btn" @click="insertVerticalSpacing"><icon name="arrows-v"></icon> Vertical Spacing</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="font"></icon> Fonts</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertCustomTitlePageFont"><icon name="font"></icon> Title Font</button>
        <button class="btn" @click="insertCustomHeadersFont"><icon name="font"></icon> Headers Font</button>
        <button class="btn" @click="insertCustomNoteHeadersFont"><icon name="font"></icon> Note Headers Font</button>
        <button class="btn" @click="insertCustomRegularTextFont"><icon name="font"></icon> Regular Text Font</button>
        <button class="btn" @click="insertCustomNewspaperHeadersFont"><icon name="font"></icon> Newspaper Headers Font</button>
        <button class="btn" @click="insertCustomNewspaperTextFont"><icon name="font"></icon> Newspaper Text Font</button>
        <button class="btn" @click="insertCustomHandwritingFont"><icon name="font"></icon> Handwriting Font</button>
      </div>
    </div>
    <button class="btn btnRight" @click="scrollToPage"><icon name="arrows-v"></icon> Locate</button>
    <div class="dropdown dropdownRight">
      <button class="btn"><icon name="save"></icon> File</button>
      <div class="dropdownContent">
        <button class="btn" @click="loadFile"><icon name="save"></icon> Load File</button>
        <button class="btn" @click="saveFile"><icon name="save"></icon> Save File</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';

export default {
  name: 'Editor',
  components: {
    Icon
  },
  methods: {
    insertGreenNote: function () {
      this.$emit('insertGreenNote');
    },
    insertBrownNote: function () {
      this.$emit('insertBrownNote');
    },
    insertPurpleNote: function () {
      this.$emit('insertPurpleNote');
    },
    insertNewspaperNote: function () {
      this.$emit('insertNewspaperNote');
    },
    insertHandwrittenNote: function () {
      this.$emit('insertHandwrittenNote');
    },
    insertPhbNote: function () {
      this.$emit('insertPhbNote');
    },
    insertCocMonsterTable: function () {
      this.$emit('insertCocMonsterTable');
    },
    insertRegularPage: function () {
      this.$emit('insertRegularPage');
    },
    insertRelativeImage: function () {
      this.$emit('insertRelativeImage');
    },
    insertAbsoluteImage: function () {
      this.$emit('insertAbsoluteImage');
    },
    insertFullPageImage: function () {
      this.$emit('insertFullPageImage');
    },
    insertColumnsPage: function () {
      this.$emit('insertColumnsPage');
    },
    insertTitlePage: function () {
      this.$emit('insertTitlePage');
    },
    insertColumnBreak: function () {
      this.$emit('insertColumnBreak');
    },
    insertWideBlock: function () {
      this.$emit('insertWideBlock');
    },
    insertVerticalSpacing: function () {
      this.$emit('insertVerticalSpacing');
    },
    insertCustomTitlePageFont: function () {
      this.$emit('insertCustomTitlePageFont');
    },
    insertCustomHeadersFont: function () {
      this.$emit('insertCustomHeadersFont');
    },
    insertCustomNoteHeadersFont: function () {
      this.$emit('insertCustomNoteHeadersFont');
    },
    insertCustomRegularTextFont: function () {
      this.$emit('insertCustomRegularTextFont');
    },
    insertCustomNewspaperHeadersFont: function () {
      this.$emit('insertCustomNewspaperHeadersFont');
    },
    insertCustomNewspaperTextFont: function () {
      this.$emit('insertCustomNewspaperTextFont');
    },
    insertCustomHandwritingFont: function () {
      this.$emit('insertCustomHandwritingFont');
    },
    loadFile: function () {
      this.$emit('loadFile');
    },
    saveFile: function () {
      this.$emit('saveFile');
    },
    scrollToPage: function () {
      this.$emit('scrollToPage');
    }
  }
};
</script>