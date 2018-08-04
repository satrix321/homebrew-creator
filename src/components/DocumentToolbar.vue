<template>
  <div class="toolbar">
    <button class="btn" @click="zoomIn"><i class="fas fa-search-plus"></i></button>
    <button class="btn" @click="zoomOut"><i class="fas fa-search-minus"></i></button>
    <div class="dropdown">
      <button class="btn"><i class="fas fa-image"></i> Theme</button>
      <div class="dropdown-content">
        <button class="btn" :class="{'is-clicked': theme === 'theme-default'}" @click="toggleDefaultTheme"><i class="fas fa-image"></i> Default</button>
        <button class="btn" :class="{'is-clicked': theme === 'theme-cthulhu-1'}" @click="toggleCthulhu1Theme"><i class="fas fa-image"></i> Cthulhu 1</button>
        <button class="btn" :class="{'is-clicked': theme === 'theme-cthulhu-2'}" @click="toggleCthulhu2Theme"><i class="fas fa-image"></i> Cthulhu 2</button>
      </div>
    </div>
    <button class="btn" :class="{'is-clicked': pagesTexture}" @click="togglePagesTexture"><i class="fas fa-image"></i> Pages Texture</button>
    <button class="btn" :class="{'is-clicked': notesTexture}" @click="toggleNotesTexture"><i class="fas fa-file"></i> Notes Texture</button>
    <button class="btn btn-right">Zoom {{zoom}}%</button>
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
      pagesTexture: 'document/pagesTexture',
      notesTexture: 'document/notesTexture',
      zoom: 'document/zoom',
      theme: 'document/theme'
    })
  },
  methods: {
    zoomIn: function () {
      if (this.zoom < 100) {
        this.$store.commit('document/setOldZoom', this.zoom);
        this.$store.commit('document/setZoom', this.zoom + 10);
        this.$emit('zoomChanged');
      }
    },
    zoomOut: function () {
      if (this.zoom > 50) {
        this.$store.commit('document/setOldZoom', this.zoom);
        this.$store.commit('document/setZoom', this.zoom - 10);
        this.$emit('zoomChanged');
      }
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
    togglePagesTexture: function () {
      this.$store.commit('document/setPagesTexture', !this.pagesTexture);
    },
    toggleNotesTexture: function () {
      this.$store.commit('document/setNotesTexture', !this.notesTexture);
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
