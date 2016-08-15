import { Template } from 'meteor/templating';


Template.FileItem.viewmodel({
  _id: '',
  name: '',
  url: '',
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
      url: this.url(),
      progress: this.progress(),
      extension: this.extension(),
      isUploaded: this.isUploaded()
    };
  }
})
