<template>
  <div class="modal" :class="{'is-visible': visible}">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{title}}</h2>
      </div>
      <div class="modal-body">
        <div class="directory">
          <button class="btn directory-back" @click="goBack"><i class="fas fa-arrow-up"></i></button>
          <span class="directory-path">{{path}}</span>
        </div>
        <div class="filelist">
          <div class="filelist-container">
            <table class="filelist-table" ref="fileTable" @click="itemDeselected">
              <tbody>
                <tr class="filelist-row" v-for="file in fileList" :key="file.id" @click="itemSelected($event)" @dblclick="itemOpened($event)">
                  <td class="filelist-col-icon"><i :class="{'fas fa-folder': file.mimeType === folderMimeType, 'fas fa-file': file.mimeType !== folderMimeType}"></i></td>
                  <td class="filelist-col-name">{{file.name}}</td>
                  <td class="filelist-col-id">{{file.id}}</td>
                  <th class="filelist-col-mime">{{file.mimeType}}</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <input v-if="this.uploadMode" ref="fileName" class="input input-file-name">
        <input v-if="this.uploadMode" class="input input-file-extension" value=".hmd" disabled="disabled">
        <button class="btn btn-right" @click="ok">OK</button>
        <button class="btn btn-right" @click="cancel">Cancel</button>
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
      let selectedItem = this.$refs.fileTable.querySelector('tr.is-selected');
      if (selectedItem) {
        selectedItem.classList.remove('is-selected');
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
      let selectedId = clickedRow.querySelector('.filelist-col-id').innerHTML;
      this.selectedItem = this.fileList.find((element) => { return element.id === selectedId; });
      clickedRow.classList.add('is-selected');

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
      let selectedId = clickedRow.querySelector('.filelist-col-id').innerHTML;
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
@import '@/assets/scss/modules/button.scss';
@import '@/assets/scss/modules/input.scss';
@import '@/assets/scss/modules/modal.scss';
@import '@/assets/scss/modules/directory.scss';
@import '@/assets/scss/modules/filelist.scss';
</style>