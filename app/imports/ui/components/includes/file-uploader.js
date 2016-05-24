import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';


Template.FileUploader.viewmodel({
  attachmentFile: null,
  uploads: new ReactiveArray(),
  uploadData(fileId) {
    return _.find(this.uploads().array(), (data) => {
      return data.fileId === fileId;
    });
  },
  progress(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    const progress = uploader && uploader.progress();
    return _.isFinite(progress) ? Math.round(progress * 100) : 0;
  },
  fileName() {
    return this.attachmentFile() && this.attachmentFile().name;
  },
  upload() {
    const file = this.attachmentFile();
    if (!file) {
      return;
    }

    const _id = Random.id();
    const name = file.name;

    this.insertFile({ _id, name });

    const uploader = new Slingshot.Upload(this.slingshotDirective());
    uploader.send(file, (err, url) => {
      if (url) {
        url = encodeURI(url);
      }
      this.onUpload(err, { _id, url });
      this.removeUploadData(_id);
    });

    this.uploads().push({ fileId: _id, uploader });

    this.attachmentFile(null);
  },
  cancelUpload(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    if (uploader) {
      uploader.xhr.abort();
      this.removeUploadData(fileId);
    }
  },
  removeUploadData(fileId) {
    this.uploads().remove((item) => {
      return item.fileId === fileId;
    });
  },
  isFileUploading(fileId) {
    return !!this.uploadData(fileId);
  }
});
