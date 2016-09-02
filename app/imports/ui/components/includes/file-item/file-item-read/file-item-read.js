Template.FileItem_Read.viewmodel({
  autorun() {
    const progress = this.progress();
    const progressPercentage = progress && progress * 100 || 0;
    this.templateInstance.$('.uploading-file').css({ 'width': progressPercentage + '%' });
  },
});
