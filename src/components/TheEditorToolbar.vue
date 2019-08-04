<template>
  <div class="toolbar">

    <div @click="openMenu" class="toolbar__collapsible-group" :class="{ 'toolbar__collapsible-group--is-collapsed': isCollapsed, 'toolbar__collapsible-group--is-open': isMenuOpen }" ref="collapsibleGroup">

      <button-item class="toolbar__collapsible-group-icon">
        <i class="fas fa-bars"></i>
      </button-item>

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

      <toolbar-separator/>

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

      <toolbar-separator/>

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

      <toolbar-separator/>

      <dropdown-menu>
        <template slot="dropdown-button">
          <i class="fas fa-table"></i> Stat Blocks
        </template>
        <template slot="dropdown-content">
          <dropdown-item @click="insertCocStatBlock"><i class="fas fa-table"></i> Call of Cthulhu</dropdown-item>
          <dropdown-item @click="insertDndStatBlock"><i class="fas fa-table"></i> Dungeons & Dragons</dropdown-item>
        </template>
      </dropdown-menu>

      <toolbar-separator/>

      <dropdown-menu>
        <template slot="dropdown-button">
          <i class="fas fa-table"></i> Tables
        </template>
        <template slot="dropdown-content">
          <dropdown-item @click="insertRegularTable"><i class="fas fa-table"></i> Table</dropdown-item>
          <dropdown-item @click="insertDndCustomTable"><i class="fas fa-table"></i> Custom DnD Table</dropdown-item>
        </template>
      </dropdown-menu>

      <toolbar-separator/>

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

      <toolbar-separator/>

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

      <toolbar-separator/>

    </div>

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

const uncollapseWidth = 490;

export default {
  name: 'TheEditorToolbar',
  components: {
    ButtonItem,
    DropdownMenu,
    DropdownItem,
    ToolbarSeparator
  },
  data: function () {
    return {
      isCollapsed: false,
      isMenuOpen: false,
    };
  },
  props: ['eventBus'],
  computed: {
    ...mapGetters({
      storageProviderFileId: 'filepicker/fileId'
    })
  },
  mounted: function () {
    if (this.eventBus) {
      this.eventBus.$on('resize', () => {
        this.handleResize();
      });
    }

    window.requestAnimationFrame(this.handleResize);
  },
  methods: {
    handleResize: function () {
      if (this.isCollapsed) {
        if (this.$refs.spacer.clientWidth >= uncollapseWidth) {
          this.isCollapsed = false;
        }
      } else {
        if (!this.$refs.spacer.clientWidth) {
          this.isCollapsed = true;  
        }
      }
    },
    openMenu: function () {
      if (this.isCollapsed) {
        this.isMenuOpen = !this.isMenuOpen;
      }
    },
    insertPrimaryNote: function () { this.$emit('insertPrimaryNote'); },
    insertSecondaryNote: function () { this.$emit('insertSecondaryNote'); },
    insertTertiaryNote: function () { this.$emit('insertTertiaryNote'); },
    insertNewspaperNote: function () { this.$emit('insertNewspaperNote'); },
    insertHandwrittenNote: function () { this.$emit('insertHandwrittenNote'); },
    insertCocStatBlock: function () { this.$emit('insertCocStatBlock'); },
    insertDndStatBlock: function () { this.$emit('insertDndStatBlock'); },
    insertRegularTable: function () { this.$emit('insertRegularTable'); },
    insertDndCustomTable: function () { this.$emit('insertDndCustomTable'); },
    insertRegularPage: function () { this.$emit('insertRegularPage'); },
    insertRelativeImage: function () { this.$emit('insertRelativeImage'); },
    insertAbsoluteImage: function () { this.$emit('insertAbsoluteImage'); },
    insertFullPageImage: function () { this.$emit('insertFullPageImage'); },
    insertTwoColumnPage: function () { this.$emit('insertTwoColumnPage'); },
    insertThreeColumnPage: function () { this.$emit('insertThreeColumnPage'); },
    insertTitlePage: function () { this.$emit('insertTitlePage'); },
    insertColumnBreak: function () { this.$emit('insertColumnBreak'); },
    insertWideBlock: function () { this.$emit('insertWideBlock'); },
    insertVerticalSpacing: function () { this.$emit('insertVerticalSpacing'); },
    insertCustomTitlePageFont: function () { this.$emit('insertCustomTitlePageFont'); },
    insertCustomHeadersFont: function () { this.$emit('insertCustomHeadersFont'); },
    insertCustomNoteHeadersFont: function () { this.$emit('insertCustomNoteHeadersFont'); },
    insertCustomRegularTextFont: function () { this.$emit('insertCustomRegularTextFont'); },
    insertCustomNewspaperHeadersFont: function () { this.$emit('insertCustomNewspaperHeadersFont'); },
    insertCustomNewspaperTextFont: function () { this.$emit('insertCustomNewspaperTextFont'); },
    insertCustomHandwritingFont: function () { this.$emit('insertCustomHandwritingFont'); },
    syncFile: function () { this.$emit('syncFile'); },
    downloadGoogleDriveFile: function () { this.$emit('downloadGoogleDriveFile'); },
    uploadGoogleDriveFile: function () { this.$emit('uploadGoogleDriveFile'); },
    downloadFile: function () { this.$emit('downloadFile'); },
    uploadFile: function () { this.$emit('uploadFile'); },
    scrollToPage: function () { this.$emit('scrollToPage'); },
    switchView: function () { this.isMenuOpen = false; this.$emit('switchView'); }
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
    @media screen and (max-width: $breakpoint) {
      display: none;
    }
  }

  .mobile-only {
    @media screen and (min-width: $breakpoint + 1) {
      display: none;
    }
  }

  .switch-button {
    width: 40px;

    i {
      margin-right: 0;
    }
  }

  .toolbar__collapsible-group {
    display: flex;

    &.toolbar__collapsible-group--is-collapsed {
      height: 30px;
      cursor: pointer;
      display: block;
      z-index: 5;

      &.toolbar__collapsible-group--is-open {
        display: flex;
        flex-direction: column;
        align-items: stretch;

        > .button, > .dropdown {
          display: initial;
          border-bottom: 1px solid $toolbar-separator-color;

          &.toolbar__collapsible-group-icon {
            border-bottom: 0;

            + * {
              border-top: 1px solid $toolbar-separator-color;
            }
          }
        }

        > .dropdown {
          position: relative;

          /deep/ .dropdown__button {
            width: 100%;
            justify-content: left;
          }

          /deep/ .dropdown__content {
            position: absolute;
            top: -1px;
            left: calc(100%);
            white-space: nowrap;
            border-left: 5px solid $toolbar-separator-color;

            .dropdown-item {
              height: 31px;
            }
          }
          
        }

      }

      > .separator, > .dropdown {
        display: none;
      }

      > .button {
        display: none;

        &.toolbar__collapsible-group-icon {
          display: inline-flex;
        }
      }
    }

    > .toolbar__collapsible-group-icon {
      display: none;
      width: 39px;
      align-items: center;
      justify-content: center;
      color: white;

      i {
        margin: 7px 0;
      }
    }
  }

  .toolbar__spacer {
    flex-grow: 1;
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
