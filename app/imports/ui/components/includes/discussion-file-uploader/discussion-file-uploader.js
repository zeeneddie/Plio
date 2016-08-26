import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';


Template.DiscussionsFileUploader.viewmodel({
  mixin: 'modal',

  //attachmentFile: null,
  attachmentFiles: [],
  uploads: new ReactiveArray(), // temporarily stores the files being uploaded

  uploadData(fileId) { // find the file with fileId is being uploaded
    return _.find(this.uploads().array(), (data) => {
      return data.fileId === fileId;
    });
  },
  progress(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    let progress = uploader && uploader.progress();
    console.log('uploadData', uploadData);
    if (!uploader) {
      progress = 0;
    }

    return _.isFinite(progress) ? Math.round(progress * 100) : 0;
  },
  fileName() {
    //return this.attachmentFile() && this.attachmentFile().name;
  },
  upload() {
    const self = this;
    const fileMaxSize = Meteor.settings.public.discussionsFilesMaxSize;// 10485760 - 10 MB,
    const files = this.attachmentFiles();
    let areBadFiles = false; // are there any files which can not be allowed for downloading
    
    if (!files.length) {
      return;
    }

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

    self.insertFile(fileDocs, (err, res, fileDocObj = null) => {
      if (err) {
        throw err;
      }

      const { _id, i } = fileDocObj;
      const file = files[i]; // original file to upload
      const uploader = new Slingshot.Upload(
        self.slingshotDirective(), self.metaContext()
      );

      this.uploads().push({ fileId: _id, uploader });

      uploader.send(file, (err, url) => {
        if(err){
          self.removeFileFromMessage(_id);

          //throw err;
          return;
        }

        if (url) {
          url = encodeURI(url);
        }

        self.onUpload(err, { _id, url });
        self.removeUploadData(_id);
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
