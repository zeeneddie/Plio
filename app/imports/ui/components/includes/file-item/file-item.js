import { Template } from 'meteor/templating';
import { Files } from '/imports/share/collections/files.js';


Template.FileItem.viewmodel({
  removeClickFn() {
    return this.onRemoveClick.bind(this);
  },
  onRemoveClick() {
    this.removeFile(this.file());
  },
});
