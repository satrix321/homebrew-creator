<template>
  <div class="toolbar">
    <button class="btn" @click="zoomIn"><i class="fas fa-search-plus"></i></button>
    <button class="btn" @click="zoomOut"><i class="fas fa-search-minus"></i></button>
    <div class="dropdown">
      <button class="btn" v-bind:class="{'is-clicked': pagesTexture}" @click="togglePagesTexture"><i class="fas fa-image"></i> Pages Texture</button>
      <div class="dropdown-content">
        <button class="btn" v-bind:class="{'is-clicked': pagesTexture}" @click="togglePagesTexture"><i class="fas fa-image"></i> Toggle Pages Texture</button>
        <button class="btn" @click="uploadPagesTexture"><i class="fas fa-share-square"></i> Upload Pages Texture<input type="file" ref="uploadPagesTextureInput" style="display: none;"></button>
        <button class="btn" @click="setDefaultPagesTexture"><i class="fas fa-times"></i> Set Default Pages Texture</button>
      </div>
    </div>
    <button class="btn" v-bind:class="{'is-clicked': notesTexture}" @click="toggleNotesTexture"><i class="fas fa-file"></i> Notes Texture</button>
    <button class="btn btn-right">Zoom {{zoom}}%</button>
    <button class="btn btn-right" @click="scrollToCursor"><i class="fas fa-arrows-alt-v"></i> Locate</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
  mounted: function () {
    let context = this;
    this.$nextTick(function () {
      this.$refs.uploadPagesTextureInput.onchange = function () {
        context.$store.commit('document/setPagesTextureFile', this.files[0]);
      };
    });
  },
  computed: {
    ...mapGetters({
      pagesTexture: 'document/pagesTexture',
      notesTexture: 'document/notesTexture',
      zoom: 'document/zoom'
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
    uploadPagesTexture: function () {
      let input = document.getElementById('uploadPagesTextureInput');
      input.value = '';
      input.click();
    },
    togglePagesTexture: function () {
      this.$store.commit('document/setPagesTexture', !this.pagesTexture);
    },
    toggleNotesTexture: function () {
      this.$store.commit('document/setNotesTexture', !this.notesTexture);
    },
    setDefaultPagesTexture: function () {
      this.$emit('setDefaultPagesTexture');
    },
    scrollToCursor: function () {
      this.$emit('scrollToCursor');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/modules/toolbar.scss";
</style>
