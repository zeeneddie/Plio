import { Template } from 'meteor/templating';

Template.ESSources.viewmodel({
  mixin: ['urlRegex', 'modal', 'filesList', 'callWithFocusCheck'],
  autorun() {
    if (!this.sourceType()) {
      this.sourceType('url');
    }
  },
  sourceType: 'url',
  sourceUrl: '',
  sourceName: '',
  fileId: '',
  shouldUpdate() {
    const { type, url, name } = this.getData();
    const { sourceType, sourceUrl, sourceName } = this.templateInstance.data;

    if (type === 'attachment') {
      return _.every([
        (type && name) || (type && url),
        (type !== sourceType) || (url !== sourceUrl) || (name !== sourceName)
      ]);
    } else {
      return _.every([
        type && url,
        (type !== sourceType) || (url !== sourceUrl)
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
  update(e) {
    let { type, url, name } = this.getData();

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

    const sourceDoc = { type, url };
    if (type === 'attachment') {
      sourceDoc.name = name;

      if (!url) {
        delete sourceDoc.url;
      }
    }

    const query = {
      [`source${this.id()}`]: sourceDoc
    };

    const updateFn = () => this.parent().update(query);

    if (type === 'attachment') {
      updateFn();
    } else {
      this.callWithFocusCheck(e, updateFn);
    }
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
    if (err && err.error !== 'Aborted') {
      this.modal().setError(err.reason);
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

      this.parent().update({}, {
        $unset: {
          [`source${this.id()}`]: ''
        }
      }, (err) =>  {
        if (!err && this.id() === 1) {
          this.parent().update({}, {
            $rename: {
              source2: 'source1'
            }
          });
        }
      });
    });
  },
  getData() {
    const { sourceType:type, sourceUrl:url, sourceName:name } = this.data();
    return { type, url, name };
  }
});
