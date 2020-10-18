<template>

  <div class="filepicker">
    <modal-item ref="modal">

      <template slot="modal-header">
        <div class="filepicker__header">
          <h2>{{downloadMode ? 'Choose File' : ''}}{{uploadMode ? 'Save As' : ''}}</h2>
          <button-item is-icon class="filepicker__icon-button" @click="signOut"><i class="fas fa-sign-in-alt"></i></button-item>
          <button-item is-icon class="filepicker__icon-button" @click="cancel"><i class="fas fa-times"></i></button-item>
        </div>
      </template>

      <template slot="modal-content">
        <div class="filepicker__directory">
          <button-item is-icon class="filepicker__icon-button" @click="goBack"><i class="fas fa-arrow-up"></i></button-item>
          <span>{{path}}</span>
        </div>
        <div class="filepicker__container">
          <table class="filepicker__table" ref="fileTable" @click="itemDeselected">
            <tbody>
              <tr class="filepicker__row" v-for="file in fileList" :key="file.id" @click.stop="itemSelected($event)" @dblclick.stop="itemOpened($event)">
                <td class="filepicker__col-icon"><i :class="{'fas fa-folder': file.mimeType === folderMimeType, 'fas fa-file': file.mimeType !== folderMimeType}"></i></td>
                <td class="filepicker__col-name">{{file.name}}</td>
                <td class="filepicker__col-modified-time">{{file.modifiedTime}}</td>
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
          <button-item @click="ok" class="filepicker__ok-button">OK</button-item>
          <button-item @click="cancel" class="filepicker__cancel-button">Cancel</button-item>
        </div>
      </template>

    </modal-item>
  </div>

</template>

<script>
import ModalItem from '@/components/ModalItem';
import ButtonItem from '@/components/ButtonItem';
import InputItem from '@/components/InputItem';
import { format } from 'date-fns';

export default {
  name: 'TheFilePicker',
  components: {
    ModalItem,
    ButtonItem,
    InputItem,
  },
  data() {
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
    setProvider(provider) {
      this.provider = provider;
    },
    setDownloadMode() {
      this.downloadMode = true;
      this.uploadMode = false;
    },
    setUploadMode() {
      this.downloadMode = false;
      this.uploadMode = true;
    },
    async show() {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      const response = await this.provider.listFiles();  
      if (response && response.status === 200) {
        this.fileList = response.result.files.map(file => { 
          return {
            id: file.id,
            name: file.name,
            mimeType: file.mimeType,
            modifiedTime: format(new Date(file.modifiedTime), 'YYYY-MM-DD HH:mm'),
          };
        });
      } else {
        alert(response);
      }

      this.path = '/';
      this.visible = true;
      this.$refs.modal.show();
    },
    clearSelection() {
      const selectedItem = this.$refs.fileTable.querySelector('.filepicker__row--is-selected');
      if (selectedItem) {
        selectedItem.classList.remove('filepicker__row--is-selected');
      }
      this.selectedItem = undefined;
    },
    clearFileName() {
      if (this.$refs.fileName) {
        this.$refs.fileName.value = '';
      }
    },
    cancel() {
      this.close();
    },
    ok() {
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
    close() {
      this.clearSelection();
      this.clearFileName();
      this.pathIdList = [];
      this.visible = false;
      this.$refs.modal.hide();
    },
    async goBack() {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      if (this.path === '/') {
        return;
      }

      if (this.pathIdList.length > 0) {
        this.pathIdList.pop();
      }

      let parentId;
      if (this.pathIdList.length == 0) {
        parentId = 'root';
      } else {
        parentId = this.pathIdList[this.pathIdList.length - 1];
      }

      const response = await this.provider.listFiles(parentId);
      if (response && response.status === 200) {
        this.fileList = response.result.files;
      } else {
        alert(response);
      }

      this.path = this.path.substring(0, this.path.length - 1);
      this.path = this.path.substring(0, this.path.lastIndexOf('/'));
      this.path += '/';
    },
    itemSelected(event) {
      this.clearSelection();
      const clickedRow = event.target.parentElement;
      const selectedId = clickedRow.querySelector('.filepicker__col-id').innerHTML;
      this.selectedItem = this.fileList.find(element => element.id === selectedId);
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
    itemDeselected() {
      this.clearSelection();
    },
    itemOpened(event) {
      event.stopPropagation();

      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      const clickedRow = event.target.parentElement;
      const selectedId = clickedRow.querySelector('.filepicker__col-id').innerHTML;
      this.selectedItem = this.fileList.find(element => element.id === selectedId);

      if (this.selectedItem.mimeType === this.folderMimeType) {
        this.openFolder();
      } else if (this.downloadMode) {
        this.downloadFile();
        this.close();
      } else {
        this.uploadFile();
        this.close();
      }
    },
    async openFolder() {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }
      
      this.pathIdList.push(this.selectedItem.id);

      const response = await this.provider.listFiles(this.selectedItem.id);
      if (response && response.status === 200) {
        this.path += this.selectedItem.name + '/';
        this.selectedItem = undefined;
        this.fileList = response.result.files;
      } else {
        alert(response);
      }
    },
    downloadFile() {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      this.$store.commit('filepicker/setFileId', this.selectedItem.id);
      this.$emit('downloadFile');
    },
    uploadFile() {
      if (!this.provider) {
        alert('Storage provider not set!');
        return;
      }

      if (this.selectedItem) {
        if (this.selectedItem.mimeType === this.folderMimeType) {
          if (this.$refs.fileName.value) {
            const fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
            this.$store.commit('filepicker/setFileId', this.selectedItem.id);
            this.$store.commit('filepicker/setFileName', fileName);
            this.$store.commit('filepicker/setFileParentId', this.pathIdList.length ? this.pathIdList[this.pathIdList.length - 1] : undefined);
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extension');
            return;
          }
        } else {
          if (this.$refs.fileName.value && (this.$refs.fileName.value + '.' + this.provider.fileExtension === this.selectedItem.name)) {
            this.$store.commit('filepicker/setFileId', this.selectedItem.id);
            this.$store.commit('filepicker/setFileName', undefined);
            this.$store.commit('filepicker/setFileParentId', this.pathIdList.length ? this.pathIdList[this.pathIdList.length - 1] : undefined);
          } else if (this.$refs.fileName.value) {
            const fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
            this.$store.commit('filepicker/setFileId', undefined);
            this.$store.commit('filepicker/setFileName', fileName);
            this.$store.commit('filepicker/setFileParentId', this.pathIdList.length ? this.pathIdList[this.pathIdList.length - 1] : undefined);
          } else {
            alert('Select a file with .' + this.provider.fileExtension + ' extenion');
            return;
          }
        }

      } else {
        if (this.$refs.fileName.value && this.$refs.fileName.value !== '') {
          const fileName = this.$refs.fileName.value + '.' + this.provider.fileExtension;
          this.$store.commit('filepicker/setFileId', undefined);
          this.$store.commit('filepicker/setFileName', fileName);
          this.$store.commit('filepicker/setFileParentId', this.pathIdList.length ? this.pathIdList[this.pathIdList.length - 1] : undefined);
        } else {
          alert('Please provide file name');
          return;
        }
      }

      this.$emit('uploadFile');
    },
    signOut() {
      this.$emit('signOut');
    }
  }
};
</script>

<style lang="scss" scoped>
.filepicker {

  .filepicker__icon-button {
    border-radius: 50%;
  }

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

    .filepicker__col-modified-time {
      width: 1px;
      white-space: nowrap;
      padding-right: 10px;
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