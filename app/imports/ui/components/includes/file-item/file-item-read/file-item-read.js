Template.FileItem_Read.viewmodel({
  autorun() {
    const progress = this.progress()  * 100;
    this.templateInstance.$('.uploading-file').css({ 'width': progress + '%' });
  },
});
