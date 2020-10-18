import StorageProvider from './StorageProvider';

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
    window.gapi.load('client:auth2', this.initClient.bind(this));

    while (!window.gapi.auth2 || !window.gapi.auth2.getAuthInstance()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Initializes the API client library and sets up sign-in state listeners.
  async initClient() {
    await window.gapi.client.init({
      apiKey: this.apiKey,
      clientId: this.clientId,
      discoveryDocs: this.discoveryDocs,
      scope: this.scopes
    });
    
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
  }

  updateSigninStatus(isSignedIn) {
    this.isSignedIn = isSignedIn;
  }

  async authenticate() {
    await window.gapi.auth2.getAuthInstance().signIn();
    this.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  signOut() {
    return window.gapi.auth2.getAuthInstance().signOut();
  }

  disconnect() {
    return window.gapi.auth2.getAuthInstance().disconnect();
  }

  listFiles(folderId = 'root', pageSize = 1000) {
    return window.gapi.client.drive.files.list({
      'pageSize': pageSize,
      'fields': 'nextPageToken, files(id, name, fileExtension, mimeType, modifiedTime)',
      'spaces': 'drive',
      'q': 'trashed = false and "' + folderId + '" in parents and (name contains ".' + this.fileExtension + '" or mimeType = "application/vnd.google-apps.folder")',
    });
  }

  downloadFile(fileId) {
    return window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
  }

  async uploadFile(name, data, parentId = 'root') {
    const response = await window.gapi.client.drive.files.create({
      resource: {
        'name': name,
        'mimeType': 'application/json',
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
    return window.gapi.client.request({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media'
      },
      body: data
    });
  }
}