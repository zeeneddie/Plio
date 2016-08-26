import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
import { insert, updateUrl, updateProgress } from '/imports/api/files/methods.js'

Template.FileUploader.viewmodel({
  share: ['uploader'],
  mixin: ['modal', 'organization'],

  attachmentFile: null,
  
  uploadData(fileId) {
    return _.find(this.uploads().array(), (data) => {
      return data.fileId === fileId;
    });
  },
  upload() {
    const file = this.attachmentFile();
    if (!file) {
      return;
    }

    const name = file.name;

    this.attachmentFile(null);
    this.fileInput.val(null);

    insert.call({
      name: name,
      extension: name.split('.').pop().toLowerCase(),
      organizationId: this.organizationId()
    }, (err, fileId) => {
      if (err) {
        throw err;
      }
      this.addFile({ fileId }, (err) => {
        const modal = this.modal();

        if (err) {
          modal.setError(err.reason);
          return;
        }

        const uploader = new Slingshot.Upload(
          this.slingshotDirective(), this.metaContext()
        );

        const progressInterval = Meteor.setInterval(() => {
          const progress = uploader.progress();
          updateProgress.call({ _id: fileId, progress });
          if (!progress && progress != 0 || progress === 1) {
            Meteor.clearInterval(progressInterval);
          }
        }, 1500);

        this.uploads().push({ fileId, uploader });

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

          updateUrl.call({ _id: fileId, url });

          this.onUpload(err, { _id: fileId, url });
          this.removeUploadData(fileId);
        });

        // prevent modal's default method result handling
        return true;
      });
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
