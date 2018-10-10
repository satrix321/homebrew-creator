<template>
  <div class="toolbar">
    <div class="dropdown">
      <button class="btn"><i class="fas fa-image"></i> Theme</button>
      <div class="dropdown-content">
        <button class="btn" :class="{'is-clicked': theme === 'theme-default'}" @click="toggleDefaultTheme"><i class="fas fa-image"></i> Default</button>
        <button class="btn" :class="{'is-clicked': theme === 'theme-cthulhu-1'}" @click="toggleCthulhu1Theme"><i class="fas fa-image"></i> Cthulhu 1</button>
        <button class="btn" :class="{'is-clicked': theme === 'theme-cthulhu-2'}" @click="toggleCthulhu2Theme"><i class="fas fa-image"></i> Cthulhu 2</button>
      </div>
    </div>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-image"></i> Textures</button>
      <div class="dropdown-content">
        <button class="btn" :class="{'is-clicked': pageTexturesEnabled}" @click="togglePageTextures"><i class="fas fa-image"></i> Pages</button>
        <button class="btn" :class="{'is-clicked': noteTexturesEnabled}" @click="toggleNoteTextures"><i class="fas fa-file"></i> Notes</button>
      </div>
    </div>
    <div class="dropdown dropdown-right">
      <button class="btn">Zoom {{zoom}}%</button>
      <div class="dropdown-content">
        <button class="btn" @click="setZoom(50)">50%</button>
        <button class="btn" @click="setZoom(100)">100%</button>
        <button class="btn" @click="setZoom(150)">150%</button>
      </div>
    </div>
    <button class="btn btn-right" @click="zoomIn"><i class="fas fa-search-plus"></i></button>
    <button class="btn btn-right" @click="zoomOut"><i class="fas fa-search-minus"></i></button>
    <button class="btn btn-right">Page {{pageCount > 0 ? documentCurrentPageNumber : 0}}/{{pageCount}}</button>
    <button class="btn btn-right" @click="scrollToCursor"><i class="fas fa-arrows-alt-v"></i> Locate</button>
    <button class="btn btn-right" @click="getPDF"><i class="fas fa-file-pdf"></i> Get PDF</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
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
      this.$store.commit('document/setTheme', 'theme-default');
    },
    toggleCthulhu1Theme: function () {
      this.$store.commit('document/setTheme', 'theme-cthulhu-1');
    },
    toggleCthulhu2Theme: function () {
      this.$store.commit('document/setTheme', 'theme-cthulhu-2');
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
@import "@/assets/scss/modules/toolbar.scss";
</style>
