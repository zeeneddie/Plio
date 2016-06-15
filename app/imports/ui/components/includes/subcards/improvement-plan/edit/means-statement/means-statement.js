import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';


Template.IPMeansStatement.viewmodel({
  mixin: ['filesList', 'organization'],
  files: [],
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }, cb) {
    const fileDoc = { _id, name, extension: name.split('.').pop().toLowerCase() };

    if (this.files() && this.files().length) {
      this.parent().files(this.files().concat([fileDoc]));

      const options = {
        $push: {
          files: fileDoc
        }
      };

      this.parent().update({ options }, cb);
    } else {
      this.parent().update({
        files: [fileDoc]
      }, cb);

      this.parent().files([fileDoc]);
    }
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

      const options = {
        $pull: {
          files: { _id }
        }
      };

      this.parent().update({ options });
    });
  },
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      improvementPlanId: this._id()
    };
  }
})
