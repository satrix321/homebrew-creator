<template>

  <div class="filepicker">
    <modal-item ref="modal">

      <template slot="modal-header">
        <div class="filepicker__header">
          <h2>{{title}} - {{downloadMode ? 'Download' : ''}}{{uploadMode ? 'Upload' : ''}}</h2>
          <button-item float-right is-icon @click="signOut"><i class="fas fa-sign-in-alt"></i></button-item>
          <button-item float-right is-icon @click="cancel"><i class="fas fa-times"></i></button-item>
        </div>
      </template>

      <template slot="modal-content">
        <div class="filepicker__directory">
          <button-item float-right is-icon @click="goBack"><i class="fas fa-arrow-up"></i></button-item>
          <span>{{path}}</span>
        </div>
        <div class="filepicker__container">
          <table class="filepicker__table" ref="fileTable" @click="itemDeselected">
            <tbody>
              <tr class="filepicker__row" v-for="file in fileList" :key="file.id" @click.stop="itemSelected($event)" @dblclick.stop="itemOpened($event)">
                <td class="filepicker__col-icon"><i :class="{'fas fa-folder': file.mimeType === folderMimeType, 'fas fa-file': file.mimeType !== folderMimeType}"></i></td>
                <td class="filepicker__col-name">{{file.name}}</td>
                <td class="filepicker__col-id">{{file.id}}</td>
                <th class="filepicker__col-mime">{{file.mimeType}}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <template slot="modal-footer">
        <div class="filepicker__footer">
          <input-item v-if="this.uploadMode" ref="fileName" class="filepicker__filename"/>
          <input-item v-if="this.uploadMode" value=".hmd" disabled="disabled" class="filepicker__filetype"/>
          <button-item float-right @click="ok" class="filepicker__ok-button">OK</button-item>
          <button-item float-right @click="cancel" class="filepicker__cancel-button">Cancel</button-item>
        </div>
      </template>

    </modal-item>
  </div>

</template>

<script>
import ModalItem from '@/components/ModalItem';
import ButtonItem from '@/components/ButtonItem';
import InputItem from '@/components/InputItem';

export default {
  name: 'TheFilePicker',
  components: {
    ModalItem,
    ButtonItem,
    InputItem
  },
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
        this.$refs.modal.show();
      } else {
        alert('Storage provider not set!');
      }
    },
    clearSelection: function () {
      let selectedItem = this.$refs.fileTable.querySelector('.filepicker__row--is-selected');
      if (selectedItem) {
        selectedItem.classList.remove('filepicker__row--is-selected');
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
      this.$refs.modal.hide();
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
      this.clearSelection();
      let clickedRow = event.target.parentElement;
      let selectedId = clickedRow.querySelector('.filepicker__col-id').innerHTML;
      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });
      clickedRow.classList.add('filepicker__row--is-selected');

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
      let selectedId = clickedRow.querySelector('.filepicker__col-id').innerHTML;
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

      this.$store.commit('filepicker/setFileId', this.selectedItem.id);
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
            this.$store.commit('filepicker/setFileId', this.selectedItem.id);
            this.$store.commit('filepicker/setFileName', fileName);
            if (this.pathIdList.length > 0) {
              this.$store.commit('filepicker/setFileParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('filepicker/setFileParentId', undefined);
            }
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extension');
            return;
          }
        } else {
          if (this.$refs.fileName.value && (this.$refs.fileName.value + '.' + this.provider.fileExtension === this.selectedItem.name)) {
            this.$store.commit('filepicker/setFileId', this.selectedItem.id);
            this.$store.commit('filepicker/setFileName', undefined);
            if (this.pathIdList.length > 0) {
              this.$store.commit('filepicker/setFileParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('filepicker/setFileParentId', undefined);
            }
          } else if (this.$refs.fileName.value) {
            let fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
            this.$store.commit('filepicker/setFileId', undefined);
            this.$store.commit('filepicker/setFileName', fileName);
            if (this.pathIdList.length > 0) {
              this.$store.commit('filepicker/setFileParentId', this.pathIdList[this.pathIdList.length - 1]);
            } else {
              this.$store.commit('filepicker/setFileParentId', undefined);
            }
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extenion');
            return;
          }
        }

      } else {
        if (this.$refs.fileName.value && this.$refs.fileName.value !== '') {
          let fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
          this.$store.commit('filepicker/setFileId', undefined);
          this.$store.commit('filepicker/setFileName', fileName);
          if (this.pathIdList.length > 0) {
            this.$store.commit('filepicker/setFileParentId', this.pathIdList[this.pathIdList.length - 1]);
          } else {
            this.$store.commit('filepicker/setFileParentId', undefined);
          }
        } else {
          alert('Please provide file name');
          return;
        }
      }

      this.$emit('uploadFile');
    },
    signOut: function () {
      this.$emit('signOut');
    }
  }
};
</script>

<style lang="scss" scoped>
.filepicker {
  .filepicker__directory {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 10px;
    align-items: center;
    margin-bottom: 5px;
  }

  .filepicker__container {
    height: 450px;
    overflow-y: scroll;
  }

  .filepicker__table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0; 

    .filepicker__row {
      vertical-align: middle;
      height: 30px;
      user-select: none;

      &.filepicker__row--is-selected {
        background-color: $filepicker-selected-row-background-color;
      }

      &:hover {
        cursor: pointer;
        background-color: $filepicker-row-hover-background-color;
      }
    }

    .filepicker__col-icon {
      width: 30px;
      text-align: center;

      .fas.fa-folder {
        color: $filepicker-folder-color;
      }
    }

    .filepicker__col-id, .filepicker__col-mime {
      display: none;
    }
  }


  .filepicker__header {
    display: grid;
    grid-column-gap: 5px;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    width: 100%;
  }

  .filepicker__footer {
    display: grid;
    grid-template-columns: 60% 5% 10px 1fr 10px 1fr;

    .filepicker__filename {
      grid-column-start: 1;
      grid-column-end: 2;
    }

    .filepicker__filetype {
      grid-column-start: 2;
      grid-column-end: 3;
    }

    .filepicker__ok-button {
      grid-column-start: 4;
      grid-column-end: 5;
    }

    .filepicker__cancel-button {
      grid-column-start: 6;
      grid-column-end: 7;
    }
  }
}
</style>