import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

import UploadService from '/imports/ui/utils/uploads/UploadService';


Template.FileUploader.viewmodel({
  mixin: ['modal', 'organization'],
  attachmentFiles: [],
  afterUpload: null,
  buttonText: 'Add',
  buttonIcon: 'fa fa-plus',
  upload() {
    const defaultFileData = { organizationId: this.organizationId() };
    const fileData = Object.assign({}, defaultFileData, this.fileData ? this.fileData() : {});

    const uploadService = new UploadService({
      slingshotDirective: this.slingshotDirective(),
      slingshotContext: this.metaContext(),
      maxFileSize: Meteor.settings.public.otherFilesMaxSize,
      fileData,
      hooks: {
        beforeInsert: () => {
          this.attachmentFiles([]);
          this.fileInput.val(null);
        },
        afterInsert: this.afterInsert,
        afterUpload: this.afterUpload,
      },
    });

    _(this.attachmentFiles()).each(file => uploadService.upload(file));
  },
});
