import { Template } from 'meteor/templating';


Template.ESIPMeansStatement.viewmodel({
  mixin: ['modal', 'filesList'],
  files: [],
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }) {
    const fileDoc = { _id, name };

    if (this.files() && this.files().length) {
      this.parent().update({}, {
        $push: {
          files: fileDoc
        }
      });
    } else {
      this.parent().update({
        files: [fileDoc]
      });
    }
  },
  onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { _id, url }) {
    if (err && err.error !== 'Aborted') {
      this.modal().setError(err.reason);
      return;
    }

    this.parent().update({
      query: {
        files: {
          $elemMatch: { _id }
        }
      }
    }, {
      $set: {
        'files.$.url': url
      }
    });
  },
  removeFileFn() {
    return this.removeFile.bind(this);
  },
  removeFile(viewModel) {
    const { _id, url } = viewModel.getData();
    const fileUploader = this.fileUploader();

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

      this.parent().update({}, {
        $pull: {
          files: { _id }
        }
      });
    });
  }
})
