import { Template } from 'meteor/templating';


Template.FileItem.viewmodel({
  _id: '',
  name: '',
  url: '',
  autorun() {
    if (!this.isUploaded()) {
      const progressWidth = 100 - this.progress();
      this.templateInstance.$('.uploading-file').css({ 'width':  progressWidth + '%'})
    }
  },
  removeClickFn() {
    return this.onRemoveClick.bind(this);
  },
  onRemoveClick() {
    this.removeFile(this);
  },
  isUploaded() {
    return this.url();
  },
  progress() {
    const uploader = this.uploader && this.uploader();
    return uploader && uploader.progress(this._id());
  },
  getData() {
    return {
      _id: this._id(),
      name: this.name(),
      url: this.url()
    };
  }
})
