import { Template } from 'meteor/templating';
import { check } from 'meteor/check'

Template.ESSources.viewmodel({
  mixin: ['urlRegex', 'modal', 'filesList', 'callWithFocusCheck', 'organization'],
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('url');
    }
  },
  sourceType: 'url',
  sourceUrl: '',
  sourceName: '',
  sourceExtension() {
    return this.sourceName().split('.').pop().toLowerCase();
  },
  sourceHtmlUrl: '',
  docxRenderInProgress: '',
  fileId: '',
  shouldUpdate() {
    const { type, url, name, htmlUrl } = this.getData();
    const { sourceType, sourceUrl, sourceName, sourceHtmlUrl } = this.templateInstance.data;

    if (type === 'attachment') {
      return _.every([
        (type && name) || (type && url),
        (type !== sourceType) || (url !== sourceUrl) || (name !== sourceName) || (htmlUrl !== sourceHtmlUrl)
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
      this.sourceName(context.sourceName || '');
    } else {
      this.sourceUrl('');
      this.sourceName('');
    }

    this.update();
  },
  update(e, cb) {
    let { type, url, name, htmlUrl } = this.getData();

    if (!this.shouldUpdate()) {
      return;
    }

    if ((url.search(/^https?\:\/\//) === -1) && (type !== 'attachment')) {
      url = `http://${url}`;
    }

    if (url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('Url is not valid!');
      return;
    }

    const sourceDoc = { type, url, htmlUrl };
    if (type === 'attachment') {
      sourceDoc.name = name;

      if (url) {
        sourceDoc.extension = url.split('.').pop();
      } else {
        delete sourceDoc.url;
      }
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
    const isDocx = this.sourceExtension() === 'docx';

    if (isDocx) {
      this.docxRenderInProgress(true);
      Meteor.call('Mammoth.convertDocxToHtml', {
        url,
        name: this.sourceName() + '.html',
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
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }, cb) {
    this.fileId(_id);
    this.sourceName(name);
    this.update(null, cb);
  },
  onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { url }) {
    if (err && err.error !== 'Aborted') {
      this.modal().setError(err.reason);
      return;
    }

    this.sourceUrl(url);
    this.renderDocx(url);
    this.update();
  },
  removeAttachmentFn() {
    return this.removeAttachment.bind(this);
  },
  removeAttachment() {
    const fileUploader = this.fileUploader();

    const isFileUploading = fileUploader.isFileUploading(this.fileId());

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
      if (isFileUploading) {
        fileUploader.cancelUpload(this.fileId());
      }

      const options = {
        $unset: {
          [`source${this.id()}`]: ''
        }
      };

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
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      standardId: this.parent().standardId()
    };
  },
  getData() {
    const { sourceType:type, sourceUrl:url, sourceName:name, sourceExtension:extension, sourceHtmlUrl:htmlUrl } = this.data();
    return { type, url, name, htmlUrl };
  }
});
