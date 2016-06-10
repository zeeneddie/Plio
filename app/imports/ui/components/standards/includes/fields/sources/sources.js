import { Template } from 'meteor/templating';

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
  sourceHtmlUrl: '',
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

      if (!url) {
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
  uploadDocxHtml(fileObj, metaContext) {
    const uploader = new Slingshot.Upload('htmlAttachmentPreview', this.uploaderMetaContext());

    uploader.send(fileObj, (error, url) => {
      this.sourceHtmlUrl(url && encodeURI(url) || '');
      this.update();
    });
  },
  renderDocx(url) {
    const isDocx = url.match(/\.([^\./\?]+)($|\?)/)[1] === 'docx';
    const vmInstance = this;

    if (isDocx) {
      Meteor.call('Mammoth.convertDocxToHtml', { url }, (error, result) => {
        if (error) {
          // HTTP errors
        } else {
          if (result.error) {
            // Mammoth errors
          } else {
            // Upload file to S3
            const htmlFileName = vmInstance.sourceName() + '.html';
            const htmlFile = new File([result], htmlFileName, { type: 'text/html' });

            vmInstance.uploadDocxHtml(htmlFile);
          }
        }
      });
    }
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
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      standardId: this.parent().standardId()
    };
  },
  getData() {
    const { sourceType:type, sourceUrl:url, sourceName:name, sourceHtmlUrl:htmlUrl } = this.data();
    return { type, url, name, htmlUrl };
  }
});
