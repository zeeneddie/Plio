Template.FileItem_Read.viewmodel({
  autorun() {
    if (!this.isUploaded()) {
      const progressWidth = 100 - this.progress(); // this.progress() must be from 100 till 0

      this.templateInstance.$('.uploading-file').css({ 'width':  progressWidth + '%' });
    }
  },
});
