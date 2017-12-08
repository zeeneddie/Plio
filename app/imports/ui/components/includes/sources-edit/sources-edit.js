import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { Files } from '/imports/share/collections/files';
import { remove as removeFile } from '/imports/api/files/methods';
import UploadsStore from '/imports/ui/utils/uploads/uploads-store';

Template.Sources_Edit.viewmodel({
  mixin: ['urlRegex', 'modal', 'callWithFocusCheck', 'organization'],
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('attachment');
    }
  },
  id: '',
  sourceType: 'attachment',
  sourceUrl: '',
  sourceFileId: '',
  docxRenderInProgress: null,
  isSourceRequired: false,
  file() {
    const fileId = this.sourceFileId();
    return Files.findOne({ _id: fileId });
  },
  shouldUpdate() {
    const { type, fileId, url } = this.getData();
    const { sourceType, sourceFileId, sourceUrl } = this.templateInstance.data;

    if (type === 'attachment') {
      return _.every([
        type, fileId,
        (type !== sourceType) || (fileId !== sourceFileId),
      ]);
    }

    return _.every([
      type,
      (!sourceUrl && url) || (sourceUrl && !url) || (sourceUrl && url),
      ((type !== sourceType) && url && (url !== sourceUrl)) ||
      ((type === sourceType) && (url !== sourceUrl)),
    ]);
  },
  changeType(type) {
    this.sourceType(type);

    const context = this.templateInstance.data;
    if (type === context.sourceType) {
      this.sourceUrl(context.sourceUrl || '');
    } else {
      this.sourceUrl('');
    }

    this.update();
  },
  update(e, cb) {
    let { type, fileId, url } = this.getData();

    if (!this.shouldUpdate()) {
      return;
    }

    const sourceDoc = { type };
    if (type === 'attachment') {
      sourceDoc.fileId = fileId;
    } else {
      if (url && (url.search(/^https?:\/\//) === -1) && (type !== 'attachment')) {
        url = `http://${url}`;
      }

      if (url && !this.isValidUrl(url)) {
        ViewModel.findOne('ModalWindow').setError('The source file url link is not valid');
        return;
      }

      sourceDoc.url = url;
    }

    const query = { [`source${this.id() || ''}`]: sourceDoc };

    if (type === 'attachment') {
      this.parent().update(query, cb);
    } else {
      this.callWithFocusCheck(e, () => {
        if (url) {
          this.parent().update(query, cb);
        } else if (!this.isSourceRequired()) {
          this._removeSourceFile();
        }
      });
    }
  },
  renderDocx(url) {
    check(url, String);

    const file = this.file();
    const isDocx = file && file.extension === 'docx';

    if (isDocx) {
      this.docxRenderInProgress(true);

      this.convertDocxToHtml(url, file, (error, result) => {
        if (error) {
          // HTTP errors
          this.renderDocxError(`Failed to get .docx file: ${error}`);
        } else if (result.error) {
          // Mammoth errors
          this.renderDocxError(`Rendering document: ${result.error}`);
        } else {
          this.docxRenderInProgress('');
        }
      });
    }
  },
  renderDocxError(error) {
    this.modal().setError(error);
    Meteor.setTimeout(() => {
      this.modal().clearError();
      this.docxRenderInProgress('');
    }, 5000);
  },
  afterInsertFn() {
    return this.afterInsert.bind(this);
  },
  afterInsert(fileId, cb) {
    this.sourceFileId(fileId);
    this.update(null, cb);
  },
  afterUploadCb() {
    return this.afterUpload.bind(this);
  },
  afterUpload(fileId, url) {
    this.renderDocx(url);
    this.update();
  },
  removeAttachmentFn() {
    return this.removeAttachment.bind(this);
  },
  removeAttachment() {
    const file = this.file();
    const isFileUploading = !file.isUploaded() && !file.isFailed();

    let warningMsg = 'This attachment will be removed';
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
        UploadsStore.terminateUploading(this.sourceFileId());
      }

      removeFile.call({ _id: file._id });
      this._removeSourceFile();
    });
  },
  _removeSourceFile() {
    const options = {
      $unset: { [`source${this.id() || ''}`]: '' },
    };

    this.parent().update({ options }, this.removeSourceFileCb);
  },
  showUploader() {
    return this.isSourceRequired() ? true : !this.file();
  },
  uploaderButtonText() {
    return this.file() ? 'Change' : 'Add';
  },
  uploaderButtonIcon() {
    return this.file() ? 'fa fa-pencil-square-o' : 'fa fa-plus';
  },
  getData() {
    const {
      sourceType: type,
      sourceFileId: fileId,
      sourceUrl: url,
      sourceExtension: extension,
    } = this.data();

    return {
      type, fileId, url, extension,
    };
  },
});
