Template.FileItem_Read.viewmodel({
  autorun() {
    if (!this.isUploaded()) {
      const progressWidth = this.progress();
      this.templateInstance.$('.uploading-file').css({ 'width':  progressWidth + '%' });
    }
  },
});
