import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';


Template.FileUploader2.viewmodel({
  mixin: 'modal',
  share: 'files',
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
      if (err) {
        throw err;
      }

      const uploader = new Slingshot.Upload(
        this.slingshotDirective(), this.metaContext()
      );
      //this.uploaderLink(uploader);

      this.uploads().push({ fileId: _id, uploader });

      uploader.send(file, (err, url) => {
        if(err){
          // [TODO] Handle error
          throw err;
        }

        if (url) {
          url = encodeURI(url);
        }

        this.onUpload(err, { _id, url });
        this.removeUploadData(_id);
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
