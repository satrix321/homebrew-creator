import StorageProvider from './StorageProvider';
import gapi from '../modules/gapi';

export default class GoogleDriveProvider extends StorageProvider {
  // Client ID and API key from the Developer Console
  get clientId() {
    return '228271316918-k2sarmhfjfi842477oqnnbofunmv7tef.apps.googleusercontent.com';
  }
  get apiKey() {
    return 'AIzaSyClUHnIHhxGPGKBQaQ9PLuzSDwbGmQ-5MM';
  }

  // Array of API discovery doc URLs for APIs used by the quickstart
  get discoveryDocs() {
    return ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  }

  // Authorization scopes required by the API; multiple scopes can be included, separated by spaces
  get scopes() {
    return 'https://www.googleapis.com/auth/drive';
  }

  get type() {
    return 'GoogleDrive';
  }

  constructor() {
    super();
  }

  async load() {
    gapi.load('client:auth2', this.initClient.bind(this));

    while (!gapi.auth2 || !gapi.auth2.getAuthInstance()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Initializes the API client library and sets up sign-in state listeners.
  async initClient() {
    await gapi.client.init({
      apiKey: this.apiKey,
      clientId: this.clientId,
      discoveryDocs: this.discoveryDocs,
      scope: this.scopes
    });
    
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
  }

  updateSigninStatus(isSignedIn) {
    this.isSignedIn = isSignedIn;
  }

  async authenticate() {
    await gapi.auth2.getAuthInstance().signIn();
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  signOut() {
    return gapi.auth2.getAuthInstance().signOut();
  }

  disconnect() {
    return gapi.auth2.getAuthInstance().disconnect();
  }

  listFiles(folderId = 'root', pageSize = 1000) {
    return gapi.client.drive.files.list({
      'pageSize': pageSize,
      'fields': 'nextPageToken, files(id, name, fileExtension, mimeType)',
      'spaces': 'drive',
      'q': 'trashed = false and "' + folderId + '" in parents and (name contains ".' + this.fileExtension + '" or mimeType = "application/vnd.google-apps.folder")',
    });
  }

  downloadFile(fileId) {
    return gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
  }

  async uploadFile(name, data, parentId = 'root') {
    let response = await gapi.client.drive.files.create({
      resource: {
        'name': name,
        'mimeType': 'application/octet-stream',
        'parents': [parentId]
      },
      fields: 'id'
    });
    
    let fileId;
    if (response && response.status === 200) {
      fileId = response.result.id;
    } else {
      throw 'Error creating the file, ' + response;
    }

    return this.updateFile(data, fileId);
  }

  updateFile(data, fileId) {
    return gapi.client.request({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      body: data
    });
  }
}