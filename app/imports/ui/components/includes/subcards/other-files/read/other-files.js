import { Template } from 'meteor/templating';
import { Files } from '/imports/api/files/files.js';

Template.Subcards_OtherFiles_Read.viewmodel({
  label: 'Other files',
  fileIds: [],

  files() {
    return Files.find({ _id: { $in: this.fileIds().array() } });
  }
});
