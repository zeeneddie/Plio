import { Template } from 'meteor/templating';
import { Files } from '/imports/share/collections/files.js';
import { remove as removeFile } from '/imports/api/files/methods.js';
import UploadsStore from '/imports/ui/utils/uploads/uploads-store.js';

Template.FileUploader_Wrapper.viewmodel({
  mixin: 'organization',
  slingshotDirective: '',

  uploader() {
    return this.child('FileUploader');
  },
  afterInsertFn() {
    return this.afterInsert.bind(this);
  },
  afterInsert(fileId, cb) {
    // if (this.files() && this.files().length) {
    const options = {
      $push: {
        fileIds: fileId
      }
    };

    this.parent().update({ options }, cb);
  },
  files() {
		const fileIds = this.fileIds() && this.fileIds().array() || [];

		return Files.find({ _id: { $in: fileIds } });
	},
  removeFileFn() {
    return this.removeFile.bind(this)
  },
  removeFile(file) {
    const { _id, url } = file;
    const isFileUploading = !file.isUploaded() && !file.isFailed();

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
        UploadsStore.terminateUploading(_id);
      }

      const options = {
        $pull: {
          fileIds: _id
        }
      };

      removeFile.call({ _id });

      this.parent().update({ options });
    });
  },
  uploaderMetaContext: {}
});
