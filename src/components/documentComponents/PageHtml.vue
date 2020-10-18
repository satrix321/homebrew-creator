<template>
  <div ref="content" class="custom-html" :class="classList">
  </div>
</template>

<script>
import parser from '@/modules/parser';

export default {
  name: 'PageHtml',
  props: {
    html: { type: String, required: true },
    pageTheme: { type: String, required: true },
    noteTexturesEnabled: { type: Boolean, required: true },
  },
  data: function () {
    return {
      createdComponents: [],
      classList: [ this.pageTheme ]
    };
  },
  created: function () {
    if (this.noteTexturesEnabled) {
      this.classList.push('custom-html--textured');
    }
  },
  mounted: function () {
    this.$refs.content.innerHTML = this.html;
    let markdownBlocks = this.$refs.content.querySelectorAll('[markdown="1"]');

    for (let block of markdownBlocks) {
      let result = parser(block.innerHTML, {
        theme: this.pageTheme, 
        noteTexturesEnabled: this.noteTexturesEnabled
      });
      this.createdComponents = result.createdComponents;

      for (let i = 0; i < this.createdComponents.length; i++) {
        if (i === 0) {
          this.createdComponents[i].classList.push('first');
        }
        if (i === this.createdComponents.length - 1) {
          this.createdComponents[i].classList.push('last');
        }
        this.createdComponents[i].$mount();
      }

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
  margin-bottom: 10px;

  ::v-deep .prop {
    margin-bottom: 0;

    &.prop--handwritten {
      p {
        font-family: 'handwriting';
        font-size: 12pt;
        color: $page-prop-handwritten-color;
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

    &.prop--newspaper {
      h1, h2, h3, h4, h5, h6 {
        color: $page-prop-newspaper-color;
        font-family: 'newspaper-headers';
        white-space: initial;
      }
      
      h1 {
        text-align: center;
        font-size: 18pt;
        text-transform: uppercase;
      }

      p {
        font-family: 'newspaper-text';
        text-align: justify;
        font-size: 12pt;
        color: $page-prop-newspaper-color;
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

  &.custom-html--textured {
    ::v-deep .prop {
      &.prop--handwritten {
        background-image: url('../../assets/images/note_texture_cthulhu_02.jpg');
        background-repeat: no-repeat;
        background-position: center;
      }

      &.prop--newspaper {
        background-color: $page-prop-newspaper-background-color;
      }
    }
  }

  ::v-deep {
    .image {
      &.image--absolute {
        position: absolute;
        z-index: -1;
      }
      
      &.image--fullpage {
        position: absolute;
        z-index: -1;
        left: 0cm;
        top: 0cm;
        width: 21cm;
        height: 29.7cm;
      }
    }

    .custom-table {
      &.custom-table--dnd {
        margin-top: 25px;
        margin-bottom: 40px;
        border-collapse: separate;
        background-color: white;
        border: initial;
        border-style: solid;
        border-image-outset: 25px 17px;
        border-image-repeat: stretch;
        border-image-slice: 150 200 150 200;
        border-image-source: url('../../assets/images/dnd_custom_table_border.png');
        border-image-width: 47px;
      }
    }

    .stat-block {
      margin-bottom: 0;

      &.stat-block--dnd {
        box-shadow: 0px 0px 10px #727159;
        background-image: url('../../assets/images/texture_02.jpg');
        position: relative;

        &:before {
          content: '';
          background-color: #D3900B;
          background-size: cover;
          border: 1px solid black;
          display: block;
          position: absolute;
          height: 5px;
          top: -4px;
          left: -1px;
          width: 100%;
        }

        &:after {
          content: '';
          background-color: #D3900B;
          background-size: cover;
          border: 1px solid black;
          display: block;
          position: absolute;
          height: 5px;
          left: -1px;
          bottom: 0;
          width: 100%;
        }

        > p:first-child {
          padding-top: 10px;
        }

        > p:last-child {
          padding-bottom: 10px;
        }

        p {
          margin-bottom: 5px;
        }

        hr {
          border: 0;
          background-image: url('../../assets/images/dnd_stat_block_separator.svg');
          background-repeat: no-repeat;
          background-size: 100% 8px;
          margin: 0 8px;
          height: 12px;
        }

        ul {
          list-style: none;
          padding-left: 0;
          margin-left: 8px !important;
          margin-right: 8px !important;
          margin-bottom: 5px;

          p {
            text-align: left;
            padding-left: 10px;
            text-indent: -10px;
            margin-bottom: 0;
          }
        }

        table {
          padding-left: 8px !important;
          padding-right: 8px !important;
          margin-bottom: 2px;

          th {
            color: #6A1C0F;
          }

          th, td {
            width: 16.66%;
          }

          tr {
            background-color: transparent !important;
          }
        }

        > h1, > h2, > h3, > h4, > h5, > h6, > p {
          margin-left: 8px !important;
          margin-right: 8px !important;
        }

        h1 {
          margin: 0;
          font-size: 16pt;
        }
        h2 {
          margin: 0;
          font-size: 12pt;
          margin-bottom: 5px;
          border-bottom: 1px solid #6A1C0F;
        }
      }

      &.stat-block--cthulhu {
        border: none;
        box-shadow: 0px 0px 1px gray;

        table {
          width: calc(100% + 1px);
          border-collapse: collapse;
          margin-bottom: 0;

          thead {
            background-color: $page-stat-block-cthulhu-header-background-color;
          }

          &:first-child {
            border-spacing: 0;

            th {
              padding: 3px 5px;
            }

            td {
              padding: 0;
            }
          }

          &:nth-child(2) {
            th {
              padding: 0px 5px;
            }

            td {
              padding-left: 5px;
              padding-right: 5px;
            }
          }

          &:nth-child(n+2) {
            tbody {
              tr:nth-child(odd) {
                background-color: $page-stat-block-cthulhu-row-odd-background-color;
              }

              tr:nth-child(even) {
                background-color: $page-stat-block-cthulhu-row-even-background-color;
              }
            }
          }

          &:nth-child(n+3) {
            th {
              padding: 3px 5px;
            }

            td {
              padding-left: 10px;
              padding-right: 10px;
            }
          }

          &:last-child {
            margin-bottom: 0px;
          }

          th {
            font-size: 12pt;
            font-family: 'regular-text';
            text-align: left;
            color: $page-stat-block-cthulhu-header-color;
            padding: 0;
          }

          td {
            font-size: 9pt;
            font-family: 'regular-text';
          }

          &:nth-child(2) {
            td {
              font-size: 10pt;
            }
          }
        }
      }
    }
  }
}
</style>
