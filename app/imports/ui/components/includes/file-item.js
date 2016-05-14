import { Template } from 'meteor/templating';


Template.FileItem.viewmodel({
  _id: '',
  name: '',
  url: '',
  autorun() {
    if (this.isNotUploaded()) {
      const progressWidth = 100 - this.progress();
      this.templateInstance.$('.uploading-file').animate({
        width: `${progressWidth}%`
      });
    }
  },
  onRemoveClick() {
    this.removeFile(this);
  },
  isNotUploaded() {
    return !this.url();
  },
  progress() {
    const parent = this.parent();
    return parent.fileProgress && parent.fileProgress(this._id());
  },
  getData() {
    return {
      _id: this._id(),
      name: this.name(),
      url: this.url()
    };
  }
})
