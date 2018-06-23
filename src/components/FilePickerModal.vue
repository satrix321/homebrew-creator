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
        <div class="tableDiv" @click="itemDeselected">
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
      </div>
      <div class="modalFooter">
        <input v-if="this.uploadMode" ref="fileName" class="input fileName">
        <input v-if="this.uploadMode" class="input fileExtension" value=".hmd" disabled="disabled">
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
    setDownloadMode: function () {
      this.downloadMode = true;
      this.uploadMode = false;
    },
    setUploadMode: function () {
      this.downloadMode = false;
      this.uploadMode = true;
    },
    show: async function () {
      if (this.provider) {

        await this.provider.listFiles().then((response) => {
          if (response.status === 200) {
            this.fileList = response.result.files;
          } else {
            alert(response);
          }
        });

        this.path = '/';
        this.visible = true;
      } else {
        alert('Storage provider not set!');
      }
    },
    clearSelection: function () {
      let selectedItem = this.$refs.fileTable.querySelector('.selectedRow');
      if (selectedItem) {
        selectedItem.classList = [];
      }
      this.selectedItem = undefined;
    },
    clearFileName: function () {
      if (this.$refs.fileName) {
        this.$refs.fileName.value = '';
      }
    },
    cancel: function () {
      this.close();
    },
    ok: function () {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      } 
      
      if (this.downloadMode) {
        if (!this.selectedItem) {
          alert('File not selected!');
          return;
        }

        if (this.selectedItem.mimeType === this.folderMimeType) {
          this.openFolder();
        } else {
          this.downloadFile();
          this.close();
        }
      } else if (this.uploadMode) {
        if (!this.selectedItem && !this.$refs.fileName) {
          alert('Select a file or provide a name for a new file!');
          return;
        }

        if (this.selectedItem && this.selectedItem.mimeType === this.folderMimeType) {
          this.openFolder();
        } else {
          this.uploadFile();
          this.close();
        }
      } else {
        alert('Download/Upload mode not set!');
      }
    },
    close: function () {
      this.clearSelection();
      this.clearFileName();
      this.pathIdList = [];
      this.visible = false;
    },
    goBack: async function () {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      if (this.path !== '/') {
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
          } else {
            alert(response);
          }
        });

        this.path = this.path.substring(0, this.path.length - 1);
        this.path = this.path.substring(0, this.path.lastIndexOf('/'));
        this.path += '/';
      }
    },
    itemSelected: function (event) {
      event.stopPropagation();
      this.clearSelection();

      let clickedRow = event.target.parentElement;
      let selectedId = clickedRow.querySelector('.idCol').innerHTML;
      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });
      clickedRow.classList.add("selectedRow");

      if (this.uploadMode && this.selectedItem.mimeType !== this.folderMimeType) {
        if (this.selectedItem.name.length > 4 && this.selectedItem.name.substring(this.selectedItem.name.length - 4) === '.' + this.provider.fileExtension) {
          this.$refs.fileName.value = this.selectedItem.name.substring(0, this.selectedItem.name.length - 4);
        } else {
          this.$refs.fileName.value = this.selectedItem.name;
        }
      } else {
        this.clearFileName();
      }
    },
    itemDeselected: function () {
      this.clearSelection();
    },
    itemOpened: async function (event) {
      event.stopPropagation();

      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      let clickedRow = event.target.parentElement;
      let selectedId = clickedRow.querySelector('.idCol').innerHTML;
      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });

      if (this.selectedItem.mimeType === this.folderMimeType) {
        this.openFolder();
      } else {
        if (this.downloadMode) {
          this.downloadFile();
          this.close();
        } else {
          this.uploadFile();
          this.close();
        }
      }
    },
    openFolder: async function () {
      this.pathIdList.push(this.selectedItem.id);

      await this.provider.listFiles(this.selectedItem.id).then((response) => {
        if (response.status === 200) {
          this.path += this.selectedItem.name + '/';
          this.selectedItem = undefined;
          this.fileList = response.result.files;
        } else {
          alert(response);
        }
      });
    },
    downloadFile: function () {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      this.$store.commit('editor/set' + this.provider.type + 'FileId', this.selectedItem.id);
      this.$emit('downloadFile');
    },
    uploadFile: function () {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      if (this.selectedItem) {
        if (this.selectedItem.mimeType === this.folderMimeType) {
          if (this.$refs.fileName.value) {
            let fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
            this.$store.commit('editor/set' + this.provider.type + 'FileId', this.selectedItem.id);
            this.$store.commit('editor/set' + this.provider.type + 'FileName', fileName);
            if (this.pathIdList.length > 0) {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', undefined);
            }
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extension');
            return;
          }
        } else {
          if (this.$refs.fileName.value && (this.$refs.fileName.value + '.' + this.provider.fileExtension === this.selectedItem.name)) {
            this.$store.commit('editor/set' + this.provider.type + 'FileId', this.selectedItem.id);
            this.$store.commit('editor/set' + this.provider.type + 'FileName', undefined);
            if (this.pathIdList.length > 0) {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', undefined);
            }
          } else if (this.$refs.fileName.value) {
            let fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
            this.$store.commit('editor/set' + this.provider.type + 'FileId', undefined);
            this.$store.commit('editor/set' + this.provider.type + 'FileName', fileName);
            if (this.pathIdList.length > 0) {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('editor/set' + this.provider.type + 'ParentId', undefined);
            }
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extenion');
            return;
          }
        }

      } else {
        if (this.$refs.fileName.value && this.$refs.fileName.value !== '') {
          let fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
          this.$store.commit('editor/set' + this.provider.type + 'FileId', undefined);
          this.$store.commit('editor/set' + this.provider.type + 'FileName', fileName);
          if (this.pathIdList.length > 0) {
            this.$store.commit('editor/set' + this.provider.type + 'ParentId', this.pathIdList[this.pathIdList.length - 1]);
          } else {
            this.$store.commit('editor/set' + this.provider.type + 'ParentId', undefined);
          }
        } else {
          alert('Please provide file name');
          return;
        }
      }

      this.$emit('uploadFile');
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/button.scss';
@import "@/assets/scss/input.scss";

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
    margin: 5% auto 0 auto;
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

      .tableDiv {
        height: 450px;
        overflow-y:scroll;
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