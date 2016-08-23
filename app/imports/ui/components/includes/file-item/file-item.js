import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';


Template.FileItem.viewmodel({
  // _id: '',
  // name: '',
  // url: '',
  removeClickFn() {
    return this.onRemoveClick.bind(this);
  },
  onRemoveClick() {
    this.removeFile(this);
  },
  isUploaded() {
    const url = this.url();
    return !!url;
  },
  // progress() {
  //   const uploader = this.uploader && this.uploader();
  //   let progress = uploader && uploader.progress(this._id());
  //
  //   if (this.isUploaded()) {
  //     progress = 100;
  //   }
  //
  //   // console.log('progress', progress, 'isUploaded', this.isUploaded());
  //
  //   return progress;
  // },
  // getData() {
  //   return {
  //     _id: this._id(),
  //     name: this.name(),
  //     url: this.url(),
  //     progress: this.progress(),
  //     extension: this.extension(),
  //     isUploaded: this.isUploaded()
  //   };
  // }
})
