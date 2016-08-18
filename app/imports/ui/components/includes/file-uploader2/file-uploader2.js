import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';


Template.FileUploader2.viewmodel({
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

    if (!uploader) {
      progress = 1;
    }

    return _.isFinite(progress) ? Math.round(progress * 100) : 0;
  },
  fileName() {
    //return this.attachmentFile() && this.attachmentFile().name;
  },
  upload() {
    const self = this;
    /*const file = this.attachmentFile();console.dir(file);
    if (!file) {
      return;
    }*/
    const files = this.attachmentFiles();//console.dir(files);
    if (!files.length) {
      return;
    }

    const fileDocs = Array.prototype.map.call(files, (file) => {
      return {
        _id: Random.id(), name: file.name
      };
    });

    self.attachmentFiles([]);
    self.fileInput.val(null);

    self.insertFile(fileDocs, (err, res, fileId = null) => {
      //console.log('cb');console.log(fileDocs);console.log(`fileId: ${fileId}`);
      if (err) {
        throw err;
      }

      const uploader = new Slingshot.Upload(
        self.slingshotDirective(), self.metaContext()
      );
      const fileDoc = _.find(fileDocs, (file) => {
        return file._id === fileId;
      });console.log(fileDoc);

      self.uploads().push({ fileId, uploader });

      /* GET THE ORIGINAL DOWNLOADED FILE DOCUMENT, NOT FROM FILEDOCS!!!
       * Try to get by its number, not by id
      uploader.send(file, (err, url) => {
        if(err){
          let swalText = 'File has wrong format or too large size';

          if( err.reason.indexOf('File exceeds allowed size') >=0 ){
            swalText = 'File exceeds allowed size of 10 MB';
          }

          swal({
            showConfirmButton: false,
            text: swalText,
            timer: 2000,
            title: "Upload denied",
            type: 'error'
          });
          self.removeFileMessage(_id);

          //throw err;
          return;
        }

        if (url) {
          url = encodeURI(url);
        }

        self.onUpload(err, { _id, url });
        self.removeUploadData(_id);
      });
      */
    });

    /*
    const _id = Random.id(); //
    const name = file.name;

    this.attachmentFile(null);
    this.fileInput.val(null);

    this.insertFile({ _id, name }, (err) => {
      if (err) {
        throw err;
      }

      const uploader = new Slingshot.Upload(
        this.slingshotDirective(), this.metaContext()
      );

      this.uploads().push({ fileId: _id, uploader });

      uploader.send(file, (err, url) => {
        if(err){
          let swalText = 'File has wrong format or too large size';

          if( err.reason.indexOf('File exceeds allowed size') >=0 ){
            swalText = 'File exceeds allowed size of 10 MB';
          }

          swal({
            showConfirmButton: false,
            text: swalText,
            timer: 2000,
            title: "Upload denied",
            type: 'error'
          });
          this.removeFileMessage(_id);

          //throw err;
          return;
        }

        if (url) {
          url = encodeURI(url);
        }

        this.onUpload(err, { _id, url });
        this.removeUploadData(_id);
      });
    });*/
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
