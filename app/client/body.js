import { Template } from 'meteor/templating';
import { terminateUploading } from '/imports/api/files/methods.js';

Template.body.viewmodel({
  share: ['uploader'],

  onRendered() {
    window.onbeforeunload = () => {
      if (this.uploads() && this.uploads().length) {
        toastr.warning('File uploading is in progress');
        return true;
      }
    };
  }
});
