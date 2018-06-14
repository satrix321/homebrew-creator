<template>
  <div class="modal" v-bind:class="{modalShow: visible}">
    <div class="modalContent">
      <div class="modalHeader">
        <h2>{{title}}</h2>
      </div>
      <div class="modalBody">
        <div class="pathDiv">
          <button class="btn" @click="goBack"><i class="fas fa-arrow-up"></i></button>
          <span>{{path}}</span>
        </div>
        <table ref="fileTable">
          <tbody>
            <tr v-for="file in fileList" :key="file.id" @click="itemSelected($event)" @dblclick="itemOpened($event)">
              <td class="iconCol"><i v-bind:class="{'fas fa-folder folderColor': file.mimeType === folderMimeType, 'fas fa-file': file.mimeType !== folderMimeType}"></i></td>
              <td class="nameCol">{{file.name}}</td>
              <td class="idCol">{{file.id}}</td>
              <th class="mimeCol">{{file.mimeType}}</th>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modalFooter">
        <button class="btn btnRight" @click="ok">OK</button>
        <button class="btn btnRight" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilePickerModal',
  props: ['title'],
  data () {
    return {
      provider: undefined,
      fileList: [],
      pathIdList: [],
      visible: false,
      folderMimeType: 'application/vnd.google-apps.folder',
      path: '/',
      selectedItem: undefined,
      downloadMode: true,
      uploadMode: false
    };
  },
  methods: {
    setProvider: function (provider) {
      this.provider = provider;
    },
    setData: function (fileList) {
      this.fileList = fileList;
      //console.log('child ' + this.fileList);
    },
    show: async function () {
      if (this.provider) {

        await this.provider.listFiles().then((response) => {
          if (response.status === 200) {
            this.fileList = response.result.files;
          } else {
            //console.log('error');
          }
        });

        this.path = '/';
        this.visible = true;
      } else {
        //console.log('provider not set');
      }
    },
    cancel: function () {
      this.visible = false;
    },
    ok: function () {
      if (this.selectedItem && this.selectedItem.querySelector('.mimeCol').innerHTML !== this.folderMimeType) {
        //this.selectedId
      }
    },
    goBack: async function () {
      if (this.path !== '/' && this.provider) {

        let parentId = undefined;
        if (this.pathIdList.length > 0) {
          this.pathIdList.pop();
        }
        
        if (this.pathIdList.length == 0) {
          parentId = 'root';
        } else {
          parentId = this.pathIdList[this.pathIdList.length - 1];
        }

        await this.provider.listFiles(parentId).then((response) => {
          if (response.status === 200) {
            this.fileList = response.result.files;
            //console.log(this.fileList);
          } else {
            //console.log('error');
          }
        });

        this.path = this.path.substring(0, this.path.length - 1);
        this.path = this.path.substring(0, this.path.lastIndexOf('/'));
        this.path += '/';
      }
    },
    itemSelected: function (event) {
      let selectedItem = this.$refs.fileTable.querySelector('.selectedRow');
      if (selectedItem) {
        selectedItem.classList = [];
      }

      let clickedRow = event.target.parentElement;
      let selectedId = clickedRow.querySelector('.idCol').innerHTML;

      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });

      clickedRow.classList.add("selectedRow");
    },
    itemOpened: async function (event) {
      let clickedRow = event.target.parentElement;
      let selectedId = clickedRow.querySelector('.idCol').innerHTML;
      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });

      if (this.selectedItem.mimeType === this.folderMimeType && this.provider) {

        this.pathIdList.push(selectedId);

        await this.provider.listFiles(selectedId).then((response) => {
          if (response.status === 200) {
            this.path += this.selectedItem.name + '/';
            this.selectedItem = undefined;
            this.fileList = response.result.files;
          } else {
            //console.log('error');
          }
        });
      } else if (this.provider) {
        this.$store.commit('editor/set' + this.provider.type + 'FileId', selectedId);
        this.$emit('downloadFile');
        this.visible = false;
      } else {
        //console.log('provider not set');
      }
    },
    setDownloadMode: function () {
      this.downloadMode = true;
      this.uploadMode = false;
    },
    setUploadMode: function () {
      this.downloadMode = false;
      this.uploadMode = true;
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/button.scss';

.modal {
  display: none;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  font-family: $site-monoFont;

  &.modalShow {
    display: initial;
  }

  .modalContent {
    position: relative;
    background-color: #fefefe;
    margin: 15% auto;
    padding: 0;
    border: 0;
    width: 900px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
    animation-name: animatetop;
    animation-duration: 0.4s;

    @keyframes animatetop {
      from {top: -300px; opacity: 0}
      to {top: 0; opacity: 1}
    }

    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;

      &:hover,
      &:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }
    }

    .modalHeader {
      padding: 2px 16px;
      background-color: $toolbar-backgroundColor;
      color: white;

      h2 {
        margin: 15px 0;
      }
    }

    .modalBody {
      padding: 10px;
      background-color: #2a2a2a;
      color: white;

      .pathDiv {
        padding: 5px 0;
        display: flex;
        flex-direction: row;

        button {
          width: 30px;
          height: 30px;
        }

        span {
          margin-left: 10px;
          align-self: center;

        }
      }

      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;

        tr {
          vertical-align: middle;
          height: 30px;

          &.selectedRow {
            background-color: $btn-backgroundColorActive;
          }

          &:hover {
            cursor: pointer;
            background-color: $btn-backgroundColorHover;
          }
        }

        .iconCol {
          width: 30px;
          text-align: center;

          i {

            &.folderColor {
              color: rgb(255, 232, 148);
            }
          }
        }

        .idCol, .mimeCol {
          display: none;
        }
      }
    }

    .modalFooter {
      padding: 10px;
      background-color: $toolbar-backgroundColor;
      color: white;

      .btn {
        margin: 0 5px;
        width: 100px;
      }

      &::after {
        content: " ";
        display: block; 
        height: 0; 
        clear: both;
      }
    }

  }
}
</style>