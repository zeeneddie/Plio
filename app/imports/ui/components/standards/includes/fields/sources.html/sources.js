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
  uploadAttachmentCb() {
    return this.onAttachmentUploaded.bind(this);
  },
  onAttachmentUploaded(err, url, fileObj) {
    if (err) {
      this.parent().modal().setError(err);
      return;
    }

    this.sourceUrl(url);
    this.sourceName(fileObj.name);
    this.update();
  },
  removeAttachment() {
    swal({
      title: 'Are you sure?',
      text: 'This attachment will be removed',
      type: 'warning',
      showCancelButton: true,
      cancelButtonClass: 'btn-secondary',
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Remove',
      closeOnConfirm: true
    }, () => {
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
