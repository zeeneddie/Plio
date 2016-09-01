import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';


Template.FileItem.viewmodel({
  removeClickFn() {
    return this.onRemoveClick.bind(this);
  },
  onRemoveClick() {
    this.removeFile(this.file());
  }
})
