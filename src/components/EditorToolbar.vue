<style lang="scss" scoped>
@import "@/assets/scss/toolbar.scss";
</style>

<template>
  <div class="toolbar">
    <div class="dropdown">
      <button class="btn"><icon name="header"></icon> Headers</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertHeader1"><icon name="header"></icon> Header 1</button>
        <button class="btn" @click="insertHeader2"><icon name="header"></icon> Header 2</button>
        <button class="btn" @click="insertHeader3"><icon name="header"></icon> Header 3</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="sticky-note"></icon> Notes</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertGreenNote"><icon style="color: rgb(218, 230, 191);" name="sticky-note"></icon> Green</button>
        <button class="btn" @click="insertBrownNote"><icon style="color: rgb(220, 207, 172);" name="sticky-note"></icon> Brown</button>
        <button class="btn" @click="insertPurpleNote"><icon style="color: rgb(231, 227, 239);" name="sticky-note"></icon> Purple</button>
        <button class="btn" @click="insertNewspaperNote"><icon style="color: rgb(244, 244, 226)" name="sticky-note"></icon> Newspaper</button>
        <button class="btn" @click="insertHandwrittenNote"><icon style="color: rgb(244, 244, 236)" name="sticky-note"></icon> Handwritten</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="table"></icon> Tables</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertCocMonsterTable"><icon name="table"></icon> CoC - Monster Table</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><icon name="list"></icon> Lists</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertOrderedList"><icon name="list-ol"></icon> Ordered List</button>
        <button class="btn" @click="insertUnorderedList"><icon name="list-ul"></icon> Unordered List</button>
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
    insertHeader1: function () {
      this.$emit('insertHeader1');
    },
    insertHeader2: function () {
      this.$emit('insertHeader2');
    },
    insertHeader3: function () {
      this.$emit('insertHeader3');
    },
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
    insertCocMonsterTable: function () {
      this.$emit('insertCocMonsterTable');
    },
    insertOrderedList: function () {
      this.$emit('insertOrderedList');
    },
    insertUnorderedList: function () {
      this.$emit('insertUnorderedList');
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
    }
  }
};
</script>