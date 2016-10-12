import { terminateUploading } from '/imports/api/files/methods.js';
import UploadsStore from '/imports/ui/utils/uploads/uploads-store.js';

Template.FileItem_Read.viewmodel({
  file: {},
  autorun() {
    const { createdBy, progress, status, _id } = Object.assign({}, this.file());
    if (createdBy === Meteor.userId()) {
      const uploader = UploadsStore.getUploader(_id);
      if (progress < 1 && progress > 0 && !uploader && (status !== 'failed')) {
        UploadsStore.terminateUploading(_id);
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
