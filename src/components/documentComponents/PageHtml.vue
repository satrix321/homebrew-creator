<template>
  <div ref="content" :class="classList" class="custom-html">
  </div>
</template>

<script>
import parser from '@/modules/parser';

export default {
  name: 'PageHtml',
  props: {
    html: { type: String, required: true },
    theme: { type: String, required: true },
    noteTexturesEnabled: { type: Boolean, required: true }
  },
  data: function () {
    return {
      createdComponents: [],
      classList: []
    };
  },
  mounted: function () {
    if (this.noteTexturesEnabled) {
      this.classList.push('custom-html--textured');
    }
    this.$refs.content.innerHTML = this.html;
    let markdownBlocks = this.$refs.content.querySelectorAll('[markdown="1"]');
    for (let block of markdownBlocks) {
      let result = parser(block.innerHTML, {
        theme: this.theme, 
        noteTexturesEnabled: this.noteTexturesEnabled
      });
      this.createdComponents = result.createdComponents;

      for (let component of this.createdComponents) {
        component.$mount();
      }

      block.innerHTML = '';
      for (let outputComponent of result.outputComponents) {
        block.appendChild(outputComponent.$el);
      }
    }
  },
  destroyed: function () {
    for (let i = 0; i < this.createdComponents.length; i++) {
      this.createdComponents[i].$destroy();
    }
    this.createdComponents = [];
  }
};
</script>

<style lang="scss" scoped>
.custom-html {
  /deep/ .prop {
    &.prop-handwritten {
      p {
        font-family: 'handwriting';
        font-size: 12pt;
        color: black;
      }
      border-radius: 0px;
      border: 20px solid transparent;
      border-image: url('../../assets/images/note_border_cthulhu_01.png') 41;
      clip-path: polygon(
        0px 13px, 5px 13px, 8px 12px, 10px 11px, 12px 8px, 14px 0px,
        calc(100% - 14px) 0px, calc(100% - 12px) 8px, calc(100% - 10px) 11px, calc(100% - 8px) 12px, calc(100% - 5px) 13px, 100% 13px,
        100% calc(100% - 13px), calc(100% - 5px) calc(100% - 13px), calc(100% - 8px) calc(100% - 12px), calc(100% - 10px) calc(100% - 11px), calc(100% - 12px) calc(100% - 8px), calc(100% - 14px) 100%,
        13px 100%, 13px calc(100% - 5px), 12px calc(100% - 8px), 11px calc(100% - 10px), 8px calc(100% - 12px), 0px calc(100% - 14px));
      &::before {
        display: none;
      }
      &::after {
        display: none;
      }
    }
    &.prop-newspaper {
      h1 {
        font-family: 'newspaper-headers';
        text-align: center;
        font-size: 18pt;
        text-transform: uppercase;
        color: black;
      }
      p {
        font-family: 'newspaper-text';
        text-align: justify;
        font-size: 12pt;
        color: black;
      }
      border-radius: 0px;
      border: 20px solid transparent;
      border-image: url('../../assets/images/note_border_cthulhu_01.png') 41;
      clip-path: polygon(
        0px 13px, 5px 13px, 8px 12px, 10px 11px, 12px 8px, 14px 0px,
        calc(100% - 14px) 0px, calc(100% - 12px) 8px, calc(100% - 10px) 11px, calc(100% - 8px) 12px, calc(100% - 5px) 13px, 100% 13px,
        100% calc(100% - 13px), calc(100% - 5px) calc(100% - 13px), calc(100% - 8px) calc(100% - 12px), calc(100% - 10px) calc(100% - 11px), calc(100% - 12px) calc(100% - 8px), calc(100% - 14px) 100%,
        13px 100%, 13px calc(100% - 5px), 12px calc(100% - 8px), 11px calc(100% - 10px), 8px calc(100% - 12px), 0px calc(100% - 14px));
      &::before {
        display: none;
      }
      &::after {
        display: none;
      }
    }
  }
}

.custom-html.custom-html--textured {
  /deep/ .prop {
    &.prop-handwritten {
      background-image: url('../../assets/images/note_texture_cthulhu_02.jpg');
      background-repeat: no-repeat;
      background-position: center;
    }
    &.prop-newspaper {
      background-color: #F4DCC0;
    }
  }
}
</style>
