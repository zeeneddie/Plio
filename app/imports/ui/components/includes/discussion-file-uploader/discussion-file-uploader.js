import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
import { ReactiveArray } from 'meteor/manuel:reactivearray';

Template.DiscussionFileUploader.viewmodel({
  share: ['uploader'],
  mixin: ['uploader', 'modal', 'organization'],

  attachmentFiles: [],

  getData() {
    return {
      files: this.attachmentFiles(),
      maxSize: Meteor.settings.public.discussionFilesMaxSize,
      uploads: this.uploads(),
      beforeUpload: () => {
        this.attachmentFiles([]);
        this.fileInput.val(null);
      }
    }
  }
});
