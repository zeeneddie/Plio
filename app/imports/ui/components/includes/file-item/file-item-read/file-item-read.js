import { terminateUploading } from '/imports/api/files/methods.js';

Template.FileItem_Read.viewmodel({
  mixin: 'uploader',
  autorun: [
    function () {
      const progress = this.progress();
      const progressPercentage = progress && progress * 100 || 0;
      this.templateInstance.$('.uploading-file').css({ 'width': progressPercentage + '%' });
    },

    // Terminate uploading if there is no uploader and the progress < 1
    function () {
      if (this.createdBy() === Meteor.userId()) {
        const uploadData = this.uploadData(this._id());
        if (this.progress() < 1 && this.progress() > 0 && !uploadData) {
          this.terminateUploading(this._id());
        }
      }
    }
  ]
});
