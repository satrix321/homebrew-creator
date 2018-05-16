<template>
  <div class="documentToolbar">
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
    }
  }
};
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
  font-family: 'Fira Mono', monospace;
  font-size: 9pt;
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
.documentToolbar > .dropdown {
  float: left;
}
.documentToolbar > .dropdown > .dropdownContent,
.documentToolbar > .dropdown > .dropdownContent > .dropdown > .dropdownContent {
  display: none;
  position: absolute;
  background-color: rgb(65,65,65);
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 10;
  top: 30px;
  float: none;
  overflow: visible;
}
.documentToolbar > .dropdown > .dropdownContent > .dropdown > .dropdownContent {
  left: 30px;
  width: auto;
}
.documentToolbar > .dropdown > .dropdownContent > .btn {
  float: none;
  display: block;
  width: 100%;
  text-align: left;
}
.documentToolbar > .dropdown:hover > .dropdownContent,
.documentToolbar > .dropdown:hover > .dropdownContent > .dropdown:hover > .dropdownContent {
  display: block;
}
.documentToolbar .btn svg {
  vertical-align: middle;
}
</style>
