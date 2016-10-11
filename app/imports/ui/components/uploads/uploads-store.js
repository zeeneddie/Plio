import { terminateUploading } from '/imports/api/files/methods';


export default UploadsStore = {

  _uploads: [],

  uploadData(fileId) { // find the file with fileId is being uploaded
    return _(this._uploads).find(data => data.fileId === fileId);
  },

  addUploadData(fileId, uploader) {
    this._uploads.push({ fileId, uploader });
  },

  terminateUploading(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    if (uploader) {
      uploader.xhr && uploader.xhr.abort();
      this.removeUploadData(fileId);
    }

    terminateUploading.call({ _id: fileId });
  },

  removeUploadData(fileId) {
    const uploads = this._uploads;

    for (let i = 0; i < uploads.length; i++) {
      if (uploads[i].fileId === fileId) {
        uploads.splice(i, 1);
        break;
      }
    }
  }

};
