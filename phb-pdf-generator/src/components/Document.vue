<template>
  <div class="documentContainer">
    <div class="dpi"></div>
    <div class="documentToolbar">
      <button class="btn" v-on:click="zoomIn"><Icon name="search-plus"></icon></button>
      <button class="btn" v-on:click="zoomOut"><Icon name="search-minus"></icon></button>
    </div>
    <div class="document">
      <div class="spacerBlock"></div>
      <div class="pages" v-html="compiledMarkdown"></div>
      <div class="spacerBlock"></div>
    </div>
  </div>
</template>

<script>
import '@/assets/print.css'
import '@/assets/document.css'
import '@/assets/pages.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import createDocument from '../document/document.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Document',
  components: {
    Icon
  },
  data: function () {
    return {
      zoom: 100
    }
  },
  computed: {
    compiledMarkdown: function () {
      return createDocument(this.rawCode)
    },
    ...mapGetters({
      rawCode: 'rawCode'
    })
  },
  methods: {
    getDPI: function () {
      var dpiDiv = document.getElementById('dpi')
      var dpiX = dpiDiv.offsetWidth
      var dpiY = dpiDiv.offsetHeight
      return { dpiX, dpiY }
    },
    zoomIn: function () {
      if (this.zoom === 50) {
        var pagesElement = document.querySelector('.document .pages')
        var documentElement = pagesElement.parentElement
        var pagesHeight = pagesElement.clientHeight
        var documentHeight = documentElement.clientHeight

        pagesElement.style['-webkit-transform-origin'] = ''
        pagesElement.style['-moz-transform-origin'] = ''
        pagesElement.style['transform-origin'] = ''
        pagesElement.style['transform'] = ''
        pagesElement.style['height'] = (pagesHeight * 2) + 'px'
        documentElement.style['height'] = (documentHeight * 2) + 'px'

        this.zoom = 100
      }
    },
    zoomOut: function () {
      if (this.zoom === 100) {
        var pagesElement = document.querySelector('.document .pages')
        var documentElement = pagesElement.parentElement
        var pagesHeight = pagesElement.clientHeight
        var documentHeight = documentElement.clientHeight

        pagesElement.style['-webkit-transform-origin'] = 'top center'
        pagesElement.style['-moz-transform-origin'] = 'top center'
        pagesElement.style['transform-origin'] = 'top center'
        pagesElement.style['transform'] = 'scale(0.5)'
        pagesElement.style['height'] = (pagesHeight / 2) + 'px'
        documentElement.style['height'] = (documentHeight / 2) + 'px'

        this.zoom = 50
      }
    }
  }
}
</script>

<style scoped>
.documentContainer {
  background: rgb(204,204,204);
  height: 100%;
}
.documentContainer > .dpi {
  height: 1in;
  left: -100%;
  position: absolute;
  top: -100%;
  width: 1in;
  display: none;
}
.documentToolbar {
  position: absolute;
  z-index: 1;
  top: 0;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: left;
  background-color: rgb(65,65,65);
}
.documentToolbar .btn {
  width: 30px;
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: rgb(75,75,75);
  outline: none;
}
.documentToolbar .btn:hover {
  background-color: rgb(115, 115, 115);
  cursor: pointer;
}
.documentToolbar .btn::-moz-focus-inner {
   border: 0;
}
.documentToolbar .btn:active {
  background-color: rgb(95,95,95);
  padding: 0 8px 0 8px;
}
</style>
