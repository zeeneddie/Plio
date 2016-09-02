import { Template } from 'meteor/templating';
import { check } from 'meteor/check';
import { Files } from '/imports/api/files/files.js';
import { remove as removeFile } from '/imports/api/files/methods.js';

Template.ESSources.viewmodel({
  mixin: ['urlRegex', 'modal', 'callWithFocusCheck', 'organization'],
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('url');
    }
  },
  sourceType: 'url',
  sourceUrl: '',
  sourceFileId: '',
  sourceHtmlUrl: null,
  docxRenderInProgress: null,
  file() {
    return Files.findOne({ _id: this.sourceFileId() });
  },
  shouldUpdate() {
    const { type, fileId, url, htmlUrl } = this.getData();
    const { sourceType, sourceFileId, sourceUrl, sourceHtmlUrl } = this.templateInstance.data;

    if (type === 'attachment') {
      return _.every([
        type, fileId,
        (type !== sourceType) || (fileId !== sourceFileId) || (htmlUrl !== sourceHtmlUrl)
      ]);
    } else {
      return _.every([
        type && url,
        (type !== sourceType) || (url !== sourceUrl) || (htmlUrl !== sourceHtmlUrl)
      ]);
    }
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
    let { type, fileId, url, htmlUrl } = this.getData();

    if (!this.shouldUpdate()) {
      return;
    }

    if ((url.search(/^https?\:\/\//) === -1) && (type !== 'attachment')) {
      url = `http://${url}`;
    }

    if (url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('The source file url link is not valid');
      return;
    }

    let sourceDoc = { type };
    if (type === 'attachment') {
      sourceDoc.fileId = fileId;
    } else {
      sourceDoc.url = url;
      sourceDoc.htmlUrl = htmlUrl;
    }

    const query = {
      [`source${this.id()}`]: sourceDoc
    };

    const updateFn = () => this.parent().update(query, cb);

    if (type === 'attachment') {
      updateFn();
    } else {
      this.callWithFocusCheck(e, updateFn);
    }
  },
  renderDocx(url) {
    check(url, String);

    const file = this.file();
    const isDocx = file.extension === 'docx';

    if (isDocx) {
      this.docxRenderInProgress(true);
      Meteor.call('Mammoth.convertDocxToHtml', {
        url,
        fileName: file.name + '.html',
        source: `source${this.id()}`,
        standardId:  this.parent()._id(),
      }, (error, result) => {
        if (error) {
          // HTTP errors
          this.renderDocxError(`Failed to get .docx file: ${error}`);
        } else {
          if (result.error) {
            // Mammoth errors
            this.renderDocxError(`Rendering document: ${result.error}`);
          } else {
            this.docxRenderInProgress('');
            this.sourceHtmlUrl(result);
          }
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
  addFileFn() {
    return this.addFile.bind(this);
  },
  addFile({ fileId }, cb) {
    this.sourceFileId(fileId);
    this.update(null, cb);
  },
  afterUploadCb() {
    return this.afterUpload.bind(this);
  },
  afterUpload({ fileId, url }) {
    this.renderDocx(url);
    this.update();
  },
  removeAttachmentFn() {
    return this.removeAttachment.bind(this);
  },
  removeAttachment() {
    const fileUploader = this.uploader();

    const file = this.file();
    const isFileUploading = !file.isUploaded();

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
      closeOnConfirm: true
    }, () => {
      if (fileUploader && isFileUploading) {
        fileUploader.cancelUpload(this.sourceFileId());
      }

      const options = {
        $unset: {
          [`source${this.id()}`]: ''
        }
      };

      removeFile.call({ _id: file._id });

      this.parent().update({ options }, (err) =>  {
        if (!err && this.id() === 1) {
          const options = {
            $rename: {
              source2: 'source1'
            }
          };
          this.parent().update({ options });
        }
      });
    });
  },
  uploader() {
    return this.child('FileUploader');
  },
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      standardId: this.parent().standardId()
    };
  },
  getData() {
    const { sourceType: type, sourceFileId: fileId, sourceUrl: url, sourceExtension: extension, sourceHtmlUrl: htmlUrl } = this.data();
    return { type, fileId, url, htmlUrl };
  }
});
