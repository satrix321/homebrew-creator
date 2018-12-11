<template>
  <div ref="content" :class="classList"/>
</template>

<script>
export default {
  name: 'PageNote',
  props: {
    noteType: { type: String, required: true },
    components: { type: Array, required: true },
    theme: { type: String, required: true },
    texturesEnabled: { type: Boolean, required: true },
    columnCount: {}
  },
  data: function () {
    return {
      classList: [ 
        'note', 
        this.noteType,
        this.theme
      ]
    };
  },
  mounted: function () {
    if (this.texturesEnabled) {
      this.classList.push('note--textured');
    }
    if (this.columnCount) {
      this.classList.push('note--columns-' + this.columnCount);
    }

    for (let component of this.components) {
      this.$refs.content.appendChild(component.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
.note {
  page-break-inside: avoid;
  margin-top: 5px;
  margin-bottom: 10px;

  &.note--primary {
    background-color: rgb(218, 230, 191);
    &.theme--default {
      border-style: solid;
      border-width: 11px;
      border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAMAAADG+c2+AAAANlBMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHL6OuAAAAEXRSTlMABAwYJDRIXHSLo7fL2+fz+6go4VUAAAB6SURBVHgB7dg5DsJQAANRZ9+Xuf9lQUKKEHT5LlL4HWB6W5d61m1zrT/dhm5j6/RjPCkJco761ixQFoSl0aXfKQ+y9/qoJnAEYar01q64gqytNBz4ghyDMPMHnyYiIiIiIgIzYeYfj/Z56x3g7ovAf2L4bxb/EWS/ql7LZCDx/Ry3RwAAAABJRU5ErkJggg==") 11;
      border-image-outset: 9px 0;
      box-shadow: 1px 4px 14px #888;
    }
    &.theme--cthulhu-1 {
      background-image: url('../../assets/images/note_texture_cthulhu_02.jpg');
      background-repeat: no-repeat;
      background-position: center; 
      border: 20px solid transparent;
      border-image: url('../../assets/images/note_border_cthulhu_01.png') 41;
      clip-path: polygon(
        0px 13px, 5px 13px, 8px 12px, 10px 11px, 12px 8px, 14px 0px,
        calc(100% - 14px) 0px, calc(100% - 12px) 8px, calc(100% - 10px) 11px, calc(100% - 8px) 12px, calc(100% - 5px) 13px, 100% 13px,
        100% calc(100% - 13px), calc(100% - 5px) calc(100% - 13px), calc(100% - 8px) calc(100% - 12px), calc(100% - 10px) calc(100% - 11px), calc(100% - 12px) calc(100% - 8px), calc(100% - 14px) 100%,
        13px 100%, 13px calc(100% - 5px), 12px calc(100% - 8px), 11px calc(100% - 10px), 8px calc(100% - 12px), 0px calc(100% - 14px));
    }
    &.theme--cthulhu-2 {
      background-color: rgba(0, 0, 0, 0.07);
      border-radius: 25px;
      border: none;
      padding: 0 20px;
      &::before,
      &::after {
        display: block;
        content: '';
        height: 50px;
        background-image: url('../../assets/images/cthulhu_note_hr_02_wide.png');
        background-repeat: no-repeat;
        background-position: center; 
        background-size: cover;
      }
      &::after {
        transform: rotate(180deg);
      }
      &.note--columns-2::before,
      &.note--columns-2::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02.png');
      }
      &.note--columns-3::before,
      &.note--columns-3::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02_narrow.png');
      }
    }
  }

  &.note--secondary {
    background-color: rgb(220, 207, 172);
    &.theme--default {
      border-style: solid;
      border-width: 7px;
      border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAMAAADG+c2+AAAAM1BMVEUAAAAAAAAAAAAkAAA1GwA0GgA5GgA5GwA4HgA7HgA5HgA7HgA7HwA7HgA8HgA7HgA8HwDn6RpAAAAAEHRSTlMAAQcHMDExQ1ZW1dXY3t7+02zZCAAAAKNJREFUWMPt2LEOwyAMBNCkSXGpKfb/f20G3AGUiWOJdNlueYrt6di2J3xHrmZF9mVCdnd3T/NgCO+ItUWdB0P4RrQWfR4chOVggUcu/cgCH0X6o+ynuivg3QjIAm8FggQJEiRIkCBBggQJEoTApO56An15EFIrVgJ4vaAtlnlwEKKbGrLATlgOxg9XeORfv9IMH+Xzb7tSzGo+gL7chNcjXpUulIwXVrjWS+0AAAAASUVORK5CYII=") 12 round;
      border-image-outset: 4px;
    }
    &.theme--cthulhu-1 {
      background-image: url('../../assets/images/note_texture_cthulhu_01.jpg');
      background-repeat: no-repeat;
      background-position: center; 
      background-size: 100% 100%;
      box-shadow: 3px 3px 5px rgba(0, 0, 0, .5);
      border-radius: 25px;
      padding: 0 20px;
      &::before,
      &::after {
        display: block;
        content: '';
        height: 50px;
        background-image: url('../../assets/images/cthulhu_note_hr_01_wide.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      &::after {
        transform: rotate(180deg);
      }
      &.note--columns-2::before,
      &.note--columns-2::after {
        background-image: url('../../assets/images/cthulhu_note_hr_01.png');
      }
      &.note--columns-3::before,
      &.note--columns-3::after {
        background-image: url('../../assets/images/cthulhu_note_hr_01_narrow.png');
      }
    }
    &.theme--cthulhu-2 {
      background-color: rgba(0, 0, 0, 0.07);
      border-radius: 25px;
      border: none;
      padding: 0 20px;
      &::before,
      &::after {
        display: block;
        content: '';
        height: 50px;
        background-image: url('../../assets/images/cthulhu_note_hr_02_wide.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      &::after {
        transform: rotate(180deg);
      }
      &.note--columns-2::before,
      &.note--columns-2::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02.png');
      }
      &.note--columns-3::before,
      &.note--columns-3::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02_narrow.png');
      }
    }
  }

  &.note--tertiary {
    background-color: rgb(231, 227, 239);
    &.theme--default {
      border-style: solid;
      border-width: 7px;
      border-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAMAAADG+c2+AAAAM1BMVEUAAAAAAAAAAAAkAAA1GwA0GgA5GgA5GwA4HgA7HgA5HgA7HgA7HwA7HgA8HgA7HgA8HwDn6RpAAAAAEHRSTlMAAQcHMDExQ1ZW1dXY3t7+02zZCAAAAKNJREFUWMPt2LEOwyAMBNCkSXGpKfb/f20G3AGUiWOJdNlueYrt6di2J3xHrmZF9mVCdnd3T/NgCO+ItUWdB0P4RrQWfR4chOVggUcu/cgCH0X6o+ynuivg3QjIAm8FggQJEiRIkCBBggQJEoTApO56An15EFIrVgJ4vaAtlnlwEKKbGrLATlgOxg9XeORfv9IMH+Xzb7tSzGo+gL7chNcjXpUulIwXVrjWS+0AAAAASUVORK5CYII=") 12 round;
      border-image-outset: 4px;
    }
    &.theme--cthulhu-1 {
      background-color: #F4EEC8;
      border: 20px solid transparent;
      border-image: url('../../assets/images/note_border_cthulhu_01.png') 41;
      clip-path: polygon(
        0px 13px, 5px 13px, 8px 12px, 10px 11px, 12px 8px, 14px 0px,
        calc(100% - 14px) 0px, calc(100% - 12px) 8px, calc(100% - 10px) 11px, calc(100% - 8px) 12px, calc(100% - 5px) 13px, 100% 13px,
        100% calc(100% - 13px), calc(100% - 5px) calc(100% - 13px), calc(100% - 8px) calc(100% - 12px), calc(100% - 10px) calc(100% - 11px), calc(100% - 12px) calc(100% - 8px), calc(100% - 14px) 100%,
        13px 100%, 13px calc(100% - 5px), 12px calc(100% - 8px), 11px calc(100% - 10px), 8px calc(100% - 12px), 0px calc(100% - 14px));
    }
    &.theme--cthulhu-2 {
      background-color: rgba(0, 0, 0, 0.07);
      border-radius: 25px;
      border: none;
      padding: 0 20px;
      &::before,
      &::after {
        display: block;
        content: '';
        height: 50px;
        background-image: url('../../assets/images/cthulhu_note_hr_02_wide.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      &::after { 
        transform: rotate(180deg);
      }
      &.note--columns-2::before,
      &.note--columns-2::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02.png');
      }
      &.note--columns-3::before,
      &.note--columns-3::after {
        background-image: url('../../assets/images/cthulhu_note_hr_02_narrow.png');
      }
    }
  }
}
</style>
