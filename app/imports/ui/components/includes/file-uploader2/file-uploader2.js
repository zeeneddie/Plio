import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';


Template.FileUploader2.viewmodel({
  mixin: 'modal',
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
    let progress = uploader && uploader.progress();
    if (!uploader) {
      progress = 1;
    }

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

    this.attachmentFile(null);
    this.fileInput.val(null);

    this.insertFile({ _id, name }, (err) => {
      const modal = this.modal();

      if (err) {
        modal.setError(err.reason);
        return;
      }

      const uploader = new Slingshot.Upload(
        this.slingshotDirective(), this.metaContext()
      );

      this.uploads().push({ fileId: _id, uploader });

      modal.clearError();
      modal.isSaving(false);
      modal.incUploadsCount();

      uploader.send(file, (err, url) => {
        modal.decUploadsCount();

        if (url) {
          url = encodeURI(url);
        }

        if (err && err.error !== 'Aborted') {
          modal.setError(err.reason);
        }

        this.onUpload(err, { _id, url });
        this.removeUploadData(_id);
      });

      // prevent modal's default method result handling
      return true;
    });
  },
  cancelUpload(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    if (uploader) {
      uploader.xhr && uploader.xhr.abort();
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
