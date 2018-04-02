<template>
  <div id="documentContainer">
    <div id='dpi'></div>
    <div id="documentToolbar">
      <button class="btn" v-on:click="zoomIn"><Icon name="search-plus"></Icon></button>
      <button class="btn" v-on:click="zoomOut"><Icon name="search-minus"></Icon></button>
    </div>
    <div id="document">
      <div class="spacerBlock"></div>
      <div class="pages">
        <div class="page" data-size="A4">
          <div class="column leftColumn"><p>{{ rawCode }}</p></div>
          <div class="column rightColumn"><p></p></div>
        </div>
        <div style="clear: both;"></div>
      </div>
      <div class="spacerBlock"></div>
    </div>
  </div>
</template>

<script>
import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
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
  computed: mapGetters({
    rawCode: 'rawCode'
  }),
  methods: {
    getDPI: function () {
      var dpiDiv = document.getElementById('dpi')
      var dpiX = dpiDiv.offsetWidth
      var dpiY = dpiDiv.offsetHeight
      return { dpiX, dpiY }
    },
    zoomIn: function () {
      if (this.zoom === 50) {
        var pagesElement = document.querySelector('#document .pages')
        var documentElement = document.getElementById('document')
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
        var pagesElement = document.querySelector('#document .pages')
        var documentElement = document.getElementById('document')
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
#dpi {
  height: 1in;
  left: -100%;
  position: absolute;
  top: -100%;
  width: 1in;
  display: none;
}
#documentToolbar {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: left;
  background-color: rgb(65,65,65);
}
#documentToolbar .btn {
  width: 30px;
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  background-color: rgb(75,75,75);
  outline: none;
}
#documentToolbar .btn:hover {
  background-color: rgb(115, 115, 115);
  cursor: pointer;
}
#documentToolbar .btn::-moz-focus-inner {
   border: 0;
}
#documentToolbar .btn:active {
  background-color: rgb(95,95,95);
  padding: 0 8px 0 8px;
}
.column {
  float: left;
  width: 10.5cm;
  height: 29.7cm;
  padding-top: 1cm;
  padding-bottom: 1cm;
  box-sizing: border-box;
  text-align: left;
}
.column > p {
  margin: 0;
}
.column.leftColumn {
  padding-left: 1.2cm;
  padding-right: 0.4cm;
}
.column.rightColumn {
  padding-left: 0.4cm;
  padding-right: 1.2cm;
}
#document {
  background: rgb(204,204,204);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}
#document > .spacerBlock {
  width: 100%;
  height: 10px;
}
#document > .pages > .page {
  background: white;
  display: block;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
#document > .pages > .page[data-size="A4"] {
  width: 21cm;
  height: 29.7cm;
}
#document > .pages > .page[data-size="A4"][data-layout="portrait"] {
  width: 29.7cm;
  height: 21cm;
}
@media print {
  body, .page {
    margin: 0;
    box-shadow: 0;
  }
}
</style>
