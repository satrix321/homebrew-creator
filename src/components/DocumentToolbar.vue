<style lang="scss" scoped>
@import "@/assets/scss/toolbar.scss";
</style>

<template>
  <div class="toolbar">
    <button class="btn" @click="zoomIn"><icon name="search-plus"></icon></button>
    <button class="btn" @click="zoomOut"><icon name="search-minus"></icon></button>
    <div class="dropdown">
      <button class="btn" v-bind:class="{btnClicked: pagesTexture}" @click="togglePagesTexture"><icon name="image"></icon> Pages Texture</button>
      <div class="dropdownContent">
        <button class="btn" v-bind:class="{btnClicked: pagesTexture}" @click="togglePagesTexture"><icon name="image"></icon> Toggle Pages Texture</button>
        <button class="btn" @click="uploadPagesTexture"><icon name="share-square"></icon> Upload Pages Texture<input type="file" id="uploadPagesTextureInput" style="display: none;"></button>
        <button class="btn" @click="setDefaultPagesTexture"><icon name="times"></icon> Set Default Pages Texture</button>
      </div>
    </div>
    <button class="btn" v-bind:class="{btnClicked: notesTexture}" @click="toggleNotesTexture"><icon name="file"></icon> Notes Texture</button>
    <button class="btn" @click="scrollToCursor"><icon name="file"></icon> Scroll To</button>
    <button class="btn btnRight">Zoom {{zoom}}%</button>
  </div>
</template>

<script>
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
  components: {
    Icon
  },
  mounted: function () {
    let context = this;
    this.$nextTick(function () {
      document.getElementById('uploadPagesTextureInput').onchange = function () {
        context.$store.commit('setPagesTextureFile', this.files[0]);
      };
    });
  },
  data () {
    return {
      pageHeight: 1141.42,
      pageOffset: 40
    };
  },
  computed: {
    ...mapGetters({
      pagesTexture: 'pagesTexture',
      notesTexture: 'notesTexture',
      zoom: 'zoom',
      currentPage: 'currentPage'
    })
  },
  methods: {
    zoomIn: function () {
      if (this.zoom < 100) {
        this.$store.commit('setZoom', this.zoom + 10);
        this.$emit('zoomChanged');
      }
    },
    zoomOut: function () {
      if (this.zoom > 50) {
        this.$store.commit('setZoom', this.zoom - 10);
        this.$emit('zoomChanged');
      }
    },
    uploadPagesTexture: function () {
      let input = document.getElementById('uploadPagesTextureInput');
      input.value = '';
      input.click();
    },
    togglePagesTexture: function () {
      this.$store.commit('setPagesTexture', !this.pagesTexture);
    },
    toggleNotesTexture: function () {
      this.$store.commit('setNotesTexture', !this.notesTexture);
    },
    setDefaultPagesTexture: function () {
      this.$emit('setDefaultPagesTexture');
    },
    scrollToCursor: function () {
      console.log(this.pageHeight);
      console.log(this.currentPage);
      console.log(this.pageOffset);
      document.querySelector('.document').scrollTo(0, this.pageHeight * this.currentPage + this.pageOffset);
    }
  }
};
</script>