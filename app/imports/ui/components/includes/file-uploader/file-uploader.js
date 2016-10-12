import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';

import UploadService from '/imports/ui/components/uploads/UploadService';


Template.FileUploader.viewmodel({
  mixin: ['modal', 'organization'],

  attachmentFiles: [],
  afterUpload: null,

  upload() {
    const uploadService = new UploadService({
      slingshotDirective: this.slingshotDirective(),
      slingshotContext: this.metaContext(),
      maxFileSize: Meteor.settings.public.otherFilesMaxSize,
      fileData: { organizationId: this.organizationId() },
      hooks: {
        beforeInsert: () => {
          this.attachmentFiles([]);
          this.fileInput.val(null);
        },
        afterInsert: this.afterInsert,
        afterUpload: this.afterUpload
      }
    });

    _(this.attachmentFiles()).each(file => uploadService.upload(file));
  }
});
