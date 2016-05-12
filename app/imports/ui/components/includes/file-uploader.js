import { Template } from 'meteor/templating';


Template.FileUploader.viewmodel({
  attachmentFile: null,
  isUploading: false,
  progress: 0,
  autorun: [
    function() {
      this.uploader = new Slingshot.Upload(this.slingshotDirective());
    },
    function() {
      const progress = this.uploader && this.uploader.progress();
      _.isFinite(progress) && this.progress(Math.round(progress * 100));
    },
    function() {
      if (this.progress() < 100 && this.progress() > 0) {
        this.isUploading(true);
      } else {
        this.isUploading(false);
      }
    }
  ],
  fileName() {
    return this.attachmentFile() && this.attachmentFile().name;
  },
  upload() {
    const attachmentFile = this.attachmentFile();
    if (!attachmentFile) {
      return;
    }

    this.uploader.send(attachmentFile, this.uploadCb);
  }
});
