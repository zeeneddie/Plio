import { Template } from 'meteor/templating';

import { Files } from '../../../../share/collections';
import { remove as removeFile } from '../../../../api/files/methods';
import UploadsStore from '../../../utils/uploads/uploads-store';
import { swal } from '../../../../client/util';

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
    if (this.onAfterInsert) return this.onAfterInsert(fileId, cb);

    const options = {
      $addToSet: {
        fileIds: fileId,
      },
    };

    return this.parent().update({ options }, cb);
  },
  files() {
    const fileIds = this.fileIds() && this.fileIds().array() || [];

    return Files.find({ _id: { $in: fileIds } });
  },
  removeFileFn() {
    return this.removeFile.bind(this);
  },
  removeFile(file) {
    const { _id } = file;
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
      closeOnConfirm: true,
    }, () => {
      if (isFileUploading) {
        UploadsStore.terminateUploading(_id);
      }

      removeFile.call({ _id });

      if (this.onAfterRemove) return this.onAfterRemove({ _id });

      const options = {
        $pull: {
          fileIds: _id,
        },
      };

      return this.parent().update({ options });
    });
  },
  uploaderMetaContext: {},
});
