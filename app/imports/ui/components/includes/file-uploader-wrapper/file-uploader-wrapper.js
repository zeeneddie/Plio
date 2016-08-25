import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';

Template.FileUploader_Wrapper.viewmodel({
  mixin: 'organization',
  slingshotDirective: '',

  uploader() {
    return this.child('FileUploader');
  },
  addFileFn() {
    return this.addFile.bind(this);
  },
  addFile({ fileId }, cb) {

    // if (this.files() && this.files().length) {
    const options = {
      $push: {
        fileIds: fileId
      }
    };

    this.parent().update({ options }, cb);
  },
  onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { fileId, url }) {
    if (err && err.error !== 'Aborted') {
      ViewModel.findOne('ModalWindow').setError(err.reason);
      return;
    }

    const options = {
      $push: {
        'fileIds': fileId
      }
    };

    this.parent().update({ options });
  },
  files() {
		const fileIds = this.fileIds() && this.fileIds().array() || [];

		return Files.find({ _id: { $in: fileIds } });
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
