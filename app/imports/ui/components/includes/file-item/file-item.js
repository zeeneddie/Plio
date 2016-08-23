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
    const url = this.url();
    return url;
  },
  progress() {
    const uploader = this.uploader && this.uploader();
    if (this.isUploaded()) {
      return 100;
    }

    // console.log('progress', progress, 'isUploaded', this.isUploaded());

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
