<template>
  <div class="documentToolbar">
    <button class="btn" @click="zoomIn"><icon name="search-plus"></icon></button>
    <button class="btn" @click="zoomOut"><icon name="search-minus"></icon></button>
    <button class="btn" v-bind:class="{btnClicked: pagesTexture}" @click="togglePagesTexture"><Icon name="image"></Icon></button>
    <button class="btn" v-bind:class="{btnClicked: notesTexture}" @click="toggleNotesTexture"><Icon name="file"></Icon></button>
    <button class="btn btnRight">Zoom {{zoom}}%</button>
  </div>
</template>

<script>
import '@/assets/css/print.css'
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import { mapGetters } from 'vuex'

export default {
  name: 'Document',
  components: {
    Icon
  },
  computed: {
    ...mapGetters({
      pagesTexture: 'pagesTexture',
      notesTexture: 'notesTexture',
      zoom: 'zoom'
    })
  },
  methods: {
    zoomIn: function () {
      if (this.zoom < 100) {
        this.$store.commit('setZoom', this.zoom + 10)
        this.$emit('zoomChanged')
      }
    },
    zoomOut: function () {
      if (this.zoom > 50) {
        this.$store.commit('setZoom', this.zoom - 10)
        this.$emit('zoomChanged')
      }
    },
    togglePagesTexture: function () {
      this.$store.commit('setPagesTexture', !this.pagesTexture)
    },
    toggleNotesTexture: function () {
      this.$store.commit('setNotesTexture', !this.notesTexture)
    }
  }
}
</script>

<style>
/* Document toolbar */
.documentToolbar {
  height: 30px;
  width: 100%;
  background-color: rgb(65, 65, 65);
}
.documentToolbar .btn {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: rgb(75, 75, 75);
  outline: none;
  float: left;
}
.documentToolbar .btn:hover {
  background-color: rgb(115, 115, 115);
  cursor: pointer;
}
.documentToolbar .btn::-moz-focus-inner {
   border: 0;
}
.documentToolbar .btn:active {
  background-color: rgb(95, 95, 95);
  padding: 0 8px 0 8px;
}
.documentToolbar .btn.btnClicked {
  background-color: rgb(25, 25, 25);
}
.documentToolbar .btn.btnClicked:hover {
  background-color: rgb(115, 115, 115);
}
.documentToolbar .btn.btnRight {
  float: right;
}
</style>
