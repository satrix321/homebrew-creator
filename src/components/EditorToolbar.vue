<style lang="scss" scoped>
@import "@/assets/scss/toolbar.scss";
</style>

<template>
  <div class="toolbar">
    <div class="dropdown">
      <button class="btn"><i class="fas fa-sticky-note"></i> Notes</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertGreenNote"><i style="color: rgb(218, 230, 191);" class="fas fa-sticky-note"></i> Green</button>
        <button class="btn" @click="insertBrownNote"><i style="color: rgb(220, 207, 172);" class="fas fa-sticky-note"></i> Brown</button>
        <button class="btn" @click="insertPurpleNote"><i style="color: rgb(231, 227, 239);" class="fas fa-sticky-note"></i> Purple</button>
        <button class="btn" @click="insertNewspaperNote"><i style="color: rgb(244, 244, 226)" class="fas fa-sticky-note"></i> Newspaper</button>
        <button class="btn" @click="insertHandwrittenNote"><i style="color: rgb(244, 244, 236)" class="fas fa-sticky-note"></i> Handwritten</button>
        <button class="btn" @click="insertPhbNote"><i class="fas fa-sticky-note"></i> PHB</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-table"></i> Tables</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertCocMonsterTable"><i class="fas fa-table"></i> CoC - Monster Table</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-file"></i> Pages</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertRegularPage"><i class="fas fa-file"></i> Regular Page</button>
        <button class="btn" @click="insertColumnsPage"><i class="fas fa-file"></i> Columns Page</button>
        <button class="btn" @click="insertTitlePage"><i class="fas fa-file"></i> Title Page</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-image"></i> Images</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertRelativeImage"><i class="fas fa-image"></i> Relative Image</button>
        <button class="btn" @click="insertAbsoluteImage"><i class="fas fa-image"></i> Absolute Image</button>
        <button class="btn" @click="insertFullPageImage"><i class="fas fa-file-image"></i> Full Page Image</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-random"></i> Misc</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertColumnBreak"><i class="fas fa-columns"></i> Column Break</button>
        <button class="btn" @click="insertWideBlock"><i class="fas fa-arrows-alt-h"></i> Wide Block</button>
        <button class="btn" @click="insertVerticalSpacing"><i class="fas fa-arrows-alt-v"></i> Vertical Spacing</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-font"></i> Fonts</button>
      <div class="dropdownContent">
        <button class="btn" @click="insertCustomTitlePageFont"><i class="fas fa-font"></i> Title Font</button>
        <button class="btn" @click="insertCustomHeadersFont"><i class="fas fa-font"></i> Headers Font</button>
        <button class="btn" @click="insertCustomNoteHeadersFont"><i class="fas fa-font"></i> Note Headers Font</button>
        <button class="btn" @click="insertCustomRegularTextFont"><i class="fas fa-font"></i> Regular Text Font</button>
        <button class="btn" @click="insertCustomNewspaperHeadersFont"><i class="fas fa-font"></i> Newspaper Headers Font</button>
        <button class="btn" @click="insertCustomNewspaperTextFont"><i class="fas fa-font"></i> Newspaper Text Font</button>
        <button class="btn" @click="insertCustomHandwritingFont"><i class="fas fa-font"></i> Handwriting Font</button>
      </div>
    </div>
    <button class="btn btnRight" @click="scrollToPage"><i class="fas fa-arrows-alt-v"></i> Locate</button>
    <div class="dropdown dropdownRight">
      <button class="btn"><i class="fas fa-file"></i> File</button>
      <div class="dropdownContent">
        <button class="btn" @click="downloadGDrive"><i class="fab fa-google-drive"></i> Download - Google Drive</button>
        <button class="btn" @click="uploadGDrive"><i class="fab fa-google-drive"></i> Upload - Google Drive</button>
        <button class="btn" @click="downloadFile"><i class="fas fa-download"></i> Download File</button>
        <button class="btn" @click="uploadFile"><i class="fas fa-upload"></i> Upload File</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Editor',
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
    downloadGDrive: function () {
      this.$emit('downloadGDrive');
    },
    uploadGDrive: function () {
      this.$emit('uploadGDDrive');
    },
    downloadFile: function () {
      this.$emit('downloadFile');
    },
    uploadFile: function () {
      this.$emit('uploadFile');
    },
    scrollToPage: function () {
      this.$emit('scrollToPage');
    }
  }
};
</script>
