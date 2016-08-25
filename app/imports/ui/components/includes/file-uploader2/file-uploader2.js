import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
import { insert, updateUrl, updateProgress } from '/imports/api/files/methods.js'

Template.FileUploader2.viewmodel({
  share: ['uploader'],
  mixin: ['modal', 'organization'],

  attachmentFile: null,

  uploadData(fileId) { // find the file with fileId is being uploaded
    return _.find(this.uploads().array(), (data) => {
      return data.fileId === fileId;
    });
  },
  progress(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    let progress = uploader && uploader.progress();

    if (!uploader) {
      progress = 100;
    }

    return _.isFinite(progress) ? Math.round(progress * 100) : 0;
  },
  fileName() {
    return this.attachmentFile() && this.attachmentFile().name;
  },
  upload() {
    const self = this;
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
        if (err) {
          throw err;
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

        this.uploads().push({ fileId: fileId, uploader });

        uploader.send(file, (err, url) => {
          if (err) {
            // [TODO] Handle error
            throw err;
          }

          if (url) {
            url = encodeURI(url);
          }

          updateUrl.call({ _id: fileId, url });
          this.removeUploadData(fileId);
        });
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
