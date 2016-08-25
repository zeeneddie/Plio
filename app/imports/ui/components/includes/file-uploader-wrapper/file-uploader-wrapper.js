import { Template } from 'meteor/templating';
import { insert, updateUrl, updateProgress } from '/imports/api/files/methods.js'

Template.FileUploader_Wrapper.viewmodel({
  mixin: 'organization',
  files: [],
  slingshotDirective: '',
  uploader() {
    return this.child('FileUploader');
  },
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ name }, cb) {

    // if (this.files() && this.files().length) {
    insert.call({
      name: name,
      extension: name.split('.').pop().toLowerCase(),
      organizationId: this.organizationId()
    }, (err, fileId) => {
      const options = {
        $push: {
          fileIds: fileId
        }
      };
    });

    this.parent().update({ options }, cb);
    //   } else {
    //     this.parent().update({
    //       files: [fileDoc]
    //     }, cb);
    // }
  },
  onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
    if (err && err.error !== 'Aborted') {
      ViewModel.findOne('ModalWindow').setError(err.reason);
      return;
    }

    const query = {
      files: {
        $elemMatch: { _id }
      }
    };
    const options = {
      $set: {
        'files.$.url': url
      }
    };

    this.parent().update({ query, options });
  },
  removeFileFn() {
    return this.removeFile.bind(this);
  },
  removeFile(viewmodel) {
    const { _id, url } = viewmodel.getData();
    const fileUploader = this.uploader();

    const isFileUploading = fileUploader.isFileUploading(_id);

    let warningMsg = 'This file will be removed';
    let buttonText = 'Remove';
    if (isFileUploading) {
      warningMsg = 'The upload process will be canceled';
      buttonText = 'OK';
    }

    swal({
      title: 'Are you sure?',
      text: warningMsg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: buttonText,
      closeOnConfirm: true
    }, () => {
      if (isFileUploading) {
        fileUploader.cancelUpload(_id);
      }

      const options = {
        $pull: {
          files: { _id }
        }
      };

      this.parent().update({ options });
    });
  },
  uploaderMetaContext: {}
});
