import { Template } from 'meteor/templating';


Template.ESIPMeansStatement.viewmodel({
  files: [],
  fileUploader() {
    return this.child('FileUploader');
  },
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }) {
    const fileDoc = { _id, name };
    
    if (this.files() && this.files().length) {
      this.parent().update({}, {
        $push: {
          'improvementPlan.files': fileDoc
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
    this.parent().update({
      'improvementPlan.files._id': _id
    }, {
      $set: {
        'improvementPlan.files.$.url': url
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
      buttonText = 'Cancel';
    }

    swal({
      title: 'Are you sure?',
      text: warningMsg,
      type: 'warning',
      showCancelButton: true,
      cancelButtonClass: 'btn-secondary',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: buttonText,
      closeOnConfirm: true
    }, () => {
      if (isFileUploading) {
        fileUploader.cancelUpload(_id);
      }

      this.parent().update({}, {
        $pull: {
          'improvementPlan.files': { _id }
        }
      });
    });
  },
  fileProgress(fileId) {
    return this.fileUploader() && this.fileUploader().progress(fileId);
  }
})
