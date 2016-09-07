import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';

Template.DiscussionFileUploader.viewmodel({
  mixin: ['uploader', 'modal', 'organization', 'notifications'],

  attachmentFiles: [],
  afterUpload: null,
  getData() {
    const data = {
      files: this.attachmentFiles(),
      maxSize: Meteor.settings.public.discussionFilesMaxSize,
      beforeUpload: () => {
        this.playNewMessageSound();
        this.attachmentFiles([]);
        this.fileInput.val(null);
      },
      afterUpload: this.afterUpload
    };

    return data;
  }
});
