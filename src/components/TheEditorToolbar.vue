<template>
  <div class="toolbar">

    <dropdown-menu :alignToRight="false">
      <template slot="dropdown-button">
        <i class="fas fa-bars toolbar__menu"></i>
      </template>
      <template slot="dropdown-content">

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-file"></i> Pages
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertRegularPage"><i class="fas fa-file"></i> Page</dropdown-item>
            <dropdown-item @click="insertTwoColumnPage"><i class="fas fa-file"></i> Two Column Page</dropdown-item>
            <dropdown-item @click="insertThreeColumnPage"><i class="fas fa-file"></i> Three Column Page</dropdown-item>
            <dropdown-item @click="insertTitlePage"><i class="fas fa-file"></i> Title Page</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-font"></i> Fonts
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertCustomTitlePageFont"><i class="fas fa-font"></i> Title Font</dropdown-item>
            <dropdown-item @click="insertCustomHeadersFont"><i class="fas fa-font"></i> Headers Font</dropdown-item>
            <dropdown-item @click="insertCustomNoteHeadersFont"><i class="fas fa-font"></i> Note Headers Font</dropdown-item>
            <dropdown-item @click="insertCustomRegularTextFont"><i class="fas fa-font"></i> Regular Text Font</dropdown-item>
            <dropdown-item @click="insertCustomNewspaperHeadersFont"><i class="fas fa-font"></i> Newspaper Headers Font</dropdown-item>
            <dropdown-item @click="insertCustomNewspaperTextFont"><i class="fas fa-font"></i> Newspaper Text Font</dropdown-item>
            <dropdown-item @click="insertCustomHandwritingFont"><i class="fas fa-font"></i> Handwriting Font</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-sticky-note"></i> Notes
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertPrimaryNote"><i style="color: rgb(218, 230, 191);" class="fas fa-sticky-note"></i> Primary</dropdown-item>
            <dropdown-item @click="insertSecondaryNote"><i style="color: rgb(220, 207, 172);" class="fas fa-sticky-note"></i> Secondary</dropdown-item>
            <dropdown-item @click="insertTertiaryNote"><i style="color: rgb(231, 227, 239);" class="fas fa-sticky-note"></i> Tertiary</dropdown-item>
            <dropdown-item @click="insertNewspaperNote"><i style="color: rgb(244, 244, 226)" class="fas fa-sticky-note"></i> Newspaper</dropdown-item>
            <dropdown-item @click="insertHandwrittenNote"><i style="color: rgb(244, 244, 236)" class="fas fa-sticky-note"></i> Handwritten</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-table"></i> Stat Blocks
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertCocStatBlock"><i class="fas fa-table"></i> Call of Cthulhu</dropdown-item>
            <dropdown-item @click="insertDndStatBlock"><i class="fas fa-table"></i> Dungeons & Dragons</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-table"></i> Tables
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertRegularTable"><i class="fas fa-table"></i> Table</dropdown-item>
            <dropdown-item @click="insertDndCustomTable"><i class="fas fa-table"></i> Custom DnD Table</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-image"></i> Images
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertRelativeImage"><i class="fas fa-image"></i> Relative Image</dropdown-item>
            <dropdown-item @click="insertAbsoluteImage"><i class="fas fa-image"></i> Absolute Image</dropdown-item>
            <dropdown-item @click="insertFullPageImage"><i class="fas fa-file-image"></i> Full Page Image</dropdown-item>
          </template>
        </dropdown-menu>

        <dropdown-menu>
          <template slot="dropdown-button">
            <i class="fas fa-random"></i> Misc
          </template>
          <template slot="dropdown-content">
            <dropdown-item @click="insertColumnBreak"><i class="fas fa-columns"></i> Column Break</dropdown-item>
            <dropdown-item @click="insertWideBlock"><i class="fas fa-arrows-alt-h"></i> Wide Block</dropdown-item>
            <dropdown-item @click="insertVerticalSpacing"><i class="fas fa-arrows-alt-v"></i> Vertical Spacing</dropdown-item>
          </template>
        </dropdown-menu>

      </template>
    </dropdown-menu>

    <toolbar-separator/>

    <div class="toolbar__spacer" ref="spacer"></div>

    <toolbar-separator/>

    <button-item @click="syncFile" :disabled="!this.storageProviderFileId"><i class="fas fa-sync"></i> Sync</button-item>

    <toolbar-separator/>

    <dropdown-menu :alignToRight="true">
      <template slot="dropdown-button">
        <i class="fas fa-file"></i> File
      </template>
      <template slot="dropdown-content">
        <dropdown-item @click="downloadGoogleDriveFile"><i class="fab fa-google-drive"></i> Download - Google Drive</dropdown-item>
        <dropdown-item @click="uploadGoogleDriveFile"><i class="fab fa-google-drive"></i> Upload - Google Drive</dropdown-item>
        <dropdown-item @click="downloadFile"><i class="fas fa-download"></i> Download File</dropdown-item>
        <dropdown-item @click="uploadFile"><i class="fas fa-upload"></i> Upload File</dropdown-item>
      </template>
    </dropdown-menu>

    <toolbar-separator class="desktop-only"/>

    <button-item class="desktop-only" @click="scrollToPage"><i class="fas fa-arrows-alt-v"></i> Locate</button-item>

    <toolbar-separator class="mobile-only"/>

    <button-item class="mobile-only switch-button" @click="switchView"><i class="fas fa-eye"></i></button-item>
    
  </div>
</template>

<script>
import ButtonItem from '@/components/ButtonItem';
import DropdownMenu from '@/components/DropdownMenu';
import DropdownItem from '@/components/DropdownItem';
import ToolbarSeparator from '@/components/ToolbarSeparator';
import { mapGetters } from 'vuex';

export default {
  name: 'TheEditorToolbar',
  components: {
    ButtonItem,
    DropdownMenu,
    DropdownItem,
    ToolbarSeparator
  },
  props: ['eventBus'],
  computed: {
    ...mapGetters({
      storageProviderFileId: 'filepicker/fileId'
    })
  },
  methods: {
    insertPrimaryNote() { this.$emit('insertPrimaryNote'); },
    insertSecondaryNote() { this.$emit('insertSecondaryNote'); },
    insertTertiaryNote() { this.$emit('insertTertiaryNote'); },
    insertNewspaperNote() { this.$emit('insertNewspaperNote'); },
    insertHandwrittenNote() { this.$emit('insertHandwrittenNote'); },
    insertCocStatBlock() { this.$emit('insertCocStatBlock'); },
    insertDndStatBlock() { this.$emit('insertDndStatBlock'); },
    insertRegularTable() { this.$emit('insertRegularTable'); },
    insertDndCustomTable() { this.$emit('insertDndCustomTable'); },
    insertRegularPage() { this.$emit('insertRegularPage'); },
    insertRelativeImage() { this.$emit('insertRelativeImage'); },
    insertAbsoluteImage() { this.$emit('insertAbsoluteImage'); },
    insertFullPageImage() { this.$emit('insertFullPageImage'); },
    insertTwoColumnPage() { this.$emit('insertTwoColumnPage'); },
    insertThreeColumnPage() { this.$emit('insertThreeColumnPage'); },
    insertTitlePage() { this.$emit('insertTitlePage'); },
    insertColumnBreak() { this.$emit('insertColumnBreak'); },
    insertWideBlock() { this.$emit('insertWideBlock'); },
    insertVerticalSpacing() { this.$emit('insertVerticalSpacing'); },
    insertCustomTitlePageFont() { this.$emit('insertCustomTitlePageFont'); },
    insertCustomHeadersFont() { this.$emit('insertCustomHeadersFont'); },
    insertCustomNoteHeadersFont() { this.$emit('insertCustomNoteHeadersFont'); },
    insertCustomRegularTextFont() { this.$emit('insertCustomRegularTextFont'); },
    insertCustomNewspaperHeadersFont() { this.$emit('insertCustomNewspaperHeadersFont'); },
    insertCustomNewspaperTextFont() { this.$emit('insertCustomNewspaperTextFont'); },
    insertCustomHandwritingFont() { this.$emit('insertCustomHandwritingFont'); },
    syncFile() { this.$emit('syncFile'); },
    downloadGoogleDriveFile() { this.$emit('downloadGoogleDriveFile'); },
    uploadGoogleDriveFile() { this.$emit('uploadGoogleDriveFile'); },
    downloadFile() { this.$emit('downloadFile'); },
    uploadFile() { this.$emit('uploadFile'); },
    scrollToPage() { this.$emit('scrollToPage'); },
    switchView() { this.$emit('switchView'); }
  }
};
</script>

<style lang="scss" scoped>
.toolbar {
  height: 30px;
  width: 100%;
  background-color: $toolbar-background-color;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  overflow: visible;

  .desktop-only {
    @media screen and (max-width: $display-breakpoint) {
      display: none;
    }
  }

  .mobile-only {
    @media screen and (min-width: $display-breakpoint + 1) {
      display: none;
    }
  }

  .switch-button {
    width: 40px;

    i {
      margin-right: 0;
    }
  }

  .toolbar__spacer {
    flex-grow: 1;
  }

  .toolbar__menu {
    margin: 0;
    width: 23px;
  }

  i {
    font-size: 16px;
    margin-right: 5px;
  }
}

@media print {
  .toolbar {
    display: none !important;
    height: 0 !important;
  }
}
</style>
