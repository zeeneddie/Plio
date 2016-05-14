import { Template } from 'meteor/templating';

Template.ESSources.viewmodel({
  mixin: 'urlRegex',
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('url');
    }
  },
  sourceType: 'url',
  sourceUrl: '',
  sourceName: '',
  fileId: '',
  fileUploader() {
    return this.child('FileUploader');
  },
  fileProgress(fileId) {
    return this.fileUploader() && this.fileUploader().progress(fileId);
  },
  shouldUpdate() {
    let { type, url, name } = this.getData();

    if (!type || !url || (type === 'attachment' && !name)) {
      return false;
    }

    const context = this.templateInstance.data;
    return (type !== context.sourceType) || (url !== context.sourceUrl);
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
  update() {
    let { type, url, name } = this.getData();

    if (!this.shouldUpdate()) {
      return;
    }

    if (url && !this.IsValidUrl(url)) {
      ViewModel.findOne('ModalWindow').setError('Url is not valid!');
      return;
    }

    const sourceDoc = { type, url };
    if (type === 'attachment') {
      sourceDoc.name = name;
    }

    const query = {
      [`source${this.id()}`]: sourceDoc
    };

    this.parent().update(query);
  },
  insertFileFn() {
    return this.insertFile.bind(this);
  },
  insertFile({ _id, name }) {
    this.fileId(_id);
    this.sourceName(name);
    this.update();
  },
  onUploadCb() {
    return this.onUpload.bind(this);
  },
  onUpload(err, { url }) {
    if (err) {
      this.parent().modal().setError(err);
      return;
    }

    this.sourceUrl(url);
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
        fileUploader.cancelUpload(this.fileId());
      }

      this.parent().update({}, {
        $unset: {
          [`source${this.id()}`]: ''
        }
      });
    });
  },
  getData() {
    const { sourceType:type, sourceUrl:url, sourceName:name } = this.data();
    return { type, url, name };
  }
});
