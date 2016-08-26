import { Template } from 'meteor/templating';
import { terminateUpload } from '/imports/api/files/methods.js';

Template.body.viewmodel({
  share: ['uploader'],

  onRendered() {
    window.onbeforeunload = () => {
      if (this.uploads() && this.uploads().length) {
        toastr.warning('File uploading is in progress');
        return true;
      }
    };

    window.unload = () => {
      _.each(this.uploads(), (upload) => {
        terminateUpload.call({
          _id: upload.fileId,
          error: {
            error: '417',
            details: 'File uploading failed because of the closed application'
          }
        });
      });
    };
  },
});
