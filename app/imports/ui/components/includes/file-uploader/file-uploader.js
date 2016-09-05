import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';

Template.FileUploader.viewmodel({
  mixin: ['uploader', 'modal', 'organization'],

  attachmentFiles: [],
  afterUpload: null,

  getData() {
    const data = {
      files: this.attachmentFiles(),
      maxSize: Meteor.settings.public.otherFilesMaxSize,
      beforeUpload: () => {
        this.attachmentFiles([]);
        this.fileInput.val(null);
      },
      afterUpload: this.afterUpload
    };

    return data;
  }
});
