import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { terminateUploading } from '/imports/api/files/methods.js';

Template.FileItem_Read.viewmodel({
  mixin: 'uploader',
  file: {},
  onRendered() {
    const { createdBy, progress, _id, status } = Object.assign({}, this.file());

    if (createdBy === Meteor.userId()) {
      const uploadData = this.uploadData(_id);
      if (progress < 1 && progress > 0 && !uploadData) {
        this.terminateUploading(_id);
      }
    }
  },
  styles() {
    return {
      getWidth({ progress = 0 } = {}) {
        const percentage = progress * 100;
        return `${percentage}%`;
      }
    }
  }
});
