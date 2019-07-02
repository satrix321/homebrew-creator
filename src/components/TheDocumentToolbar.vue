<template>
  <div class="toolbar">

    <dropdown-menu>
      <template slot="dropdown-button">
        <i class="fas fa-image"></i> Theme
      </template>
      <template slot="dropdown-content">
        <dropdown-item :is-clicked="theme === 'theme--default'" @click="toggleDefaultTheme"><i class="fas fa-image"></i> Default</dropdown-item>
        <dropdown-item :is-clicked="theme === 'theme--cthulhu-1'" @click="toggleCthulhu1Theme"><i class="fas fa-image"></i> Cthulhu 1</dropdown-item>
        <dropdown-item :is-clicked="theme === 'theme--cthulhu-2'" @click="toggleCthulhu2Theme"><i class="fas fa-image"></i> Cthulhu 2</dropdown-item>
      </template>
    </dropdown-menu>

    <toolbar-separator/>

    <dropdown-menu>
      <template slot="dropdown-button">
        <i class="fas fa-image"></i> Textures
      </template>
      <template slot="dropdown-content">
        <dropdown-item :is-clicked="pageTexturesEnabled" @click="togglePageTextures"><i class="fas fa-image"></i> Pages</dropdown-item>
        <dropdown-item :is-clicked="noteTexturesEnabled" @click="toggleNoteTextures"><i class="fas fa-file"></i> Notes</dropdown-item>
      </template>
    </dropdown-menu>

    <toolbar-separator/>

    <div class="toolbar__spacer"></div>

    <toolbar-separator/>

    <button-item @click="getPDF"><i class="fas fa-file-pdf"></i> Get PDF</button-item>

    <toolbar-separator/>
    
    <button-item @click="scrollToCursor"><i class="fas fa-arrows-alt-v"></i> Locate</button-item>

    <toolbar-separator/>

    <button-item>Page {{pageCount > 0 ? documentCurrentPageNumber : 0}}/{{pageCount}}</button-item>

    <toolbar-separator/>

    <button-item @click="zoomIn"><i class="fas fa-search-plus" style="margin-right: 0"></i></button-item>

    <toolbar-separator/>

    <button-item @click="zoomOut"><i class="fas fa-search-minus" style="margin-right: 0"></i></button-item>    

    <toolbar-separator/>
    
    <dropdown-menu>
      <template slot="dropdown-button">
        Zoom {{zoom}}%
      </template>
      <template slot="dropdown-content">
        <dropdown-item @click="setZoom(50)">50%</dropdown-item>
        <dropdown-item @click="setZoom(100)">100%</dropdown-item>
        <dropdown-item @click="setZoom(150)">150%</dropdown-item>
      </template>
    </dropdown-menu>
    
  </div>
</template>

<script>
import ButtonItem from '@/components/ButtonItem';
import DropdownMenu from '@/components/DropdownMenu';
import DropdownItem from '@/components/DropdownItem';
import ToolbarSeparator from '@/components/ToolbarSeparator';
import { mapGetters } from 'vuex';

export default {
  name: 'TheDocumentToolbar',
  components: {
    ButtonItem,
    DropdownMenu,
    DropdownItem,
    ToolbarSeparator
  },
  computed: {
    ...mapGetters({
      pageTexturesEnabled: 'document/pageTexturesEnabled',
      noteTexturesEnabled: 'document/noteTexturesEnabled',
      zoom: 'document/zoom',
      theme: 'document/theme',

      documentCurrentPageNumber: 'document/currentPageNumber',
      pageCount: 'editor/pageCount'
    })
  },
  methods: {
    setZoom: function (zoom) {
      this.$store.dispatch('document/setZoom', zoom);
      this.$emit('zoomChanged');
    },
    zoomIn: function () {
      this.$store.dispatch('document/zoomIn');
      this.$emit('zoomChanged');
    },
    zoomOut: function () {
      this.$store.dispatch('document/zoomOut');
      this.$emit('zoomChanged');
    },
    toggleDefaultTheme: function () {
      this.$store.commit('document/setTheme', 'theme--default');
    },
    toggleCthulhu1Theme: function () {
      this.$store.commit('document/setTheme', 'theme--cthulhu-1');
    },
    toggleCthulhu2Theme: function () {
      this.$store.commit('document/setTheme', 'theme--cthulhu-2');
    },
    togglePageTextures: function () {
      this.$store.commit('document/togglePageTextures');
    },
    toggleNoteTextures: function () {
      this.$store.commit('document/toggleNoteTextures');
    },
    scrollToCursor: function () {
      this.$emit('scrollToCursor');
    },
    getPDF: function () {
      this.$emit('getPDF');
    }
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
