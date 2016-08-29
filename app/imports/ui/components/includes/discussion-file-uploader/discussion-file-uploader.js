import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';
import { insert, updateUrl, updateProgress } from '/imports/api/files/methods.js'

Template.DiscussionFileUploader.viewmodel({
  share: ['uploader'],
  mixin: ['modal', 'organization'],

  attachmentFile: null,

  uploadData(fileId) { // find the file with fileId is being uploaded
    return _.find(this.uploads().array(), (data) => {
      return data.fileId === fileId;
    });
  },
  upload() {
    const self = this;
    const fileMaxSize = Meteor.settings.public.discussionsFilesMaxSize;// 10485760 - 10 MB,
    const files = this.attachmentFiles();
    let areBadFiles = false; // are there any files which can not be allowed for downloading

    if (!files.length) {
      return;
    }

    // const name = file.name;

    // File documents to insert in Messages collection with messages docs
    const fileDocs = [];
    Array.prototype.forEach.call(files, (file) => {
      if(file.size > fileMaxSize){
        areBadFiles = true;
        return;
      }

      fileDocs.push({
        _id: Random.id(), name: file.name, size: file.size
      });
    });

    // Show notification about bad files presence
    if(areBadFiles){
      swal({
        showConfirmButton: false,
        text: 'Some files exceed allowed size of 10 MB',
        timer: 2000,
        title: "Upload denied",
        type: 'error'
      });
    }

    if(!fileDocs.length){
      return;
    }

    self.attachmentFiles([]);
    self.fileInput.val(null);
    _.each(fileDocs, (file) => {
      const name = file.name;

      insert.call({
        name: name,
        extension: name.split('.').pop().toLowerCase(),
        organizationId: this.organizationId()
      }, (err, fileId) => {
        this.addFile({ fileId }, (err) => {
          if (err) {
            throw err;
          }

          const uploader = new Slingshot.Upload(
            self.slingshotDirective(), self.metaContext()
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

              //throw err;
              return;
            }

            if (url) {
              url = encodeURI(url);
            }

            updateUrl.call({ _id: fileId, url });
            this.removeUploadData(fileId);
          });
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
