import { Template } from 'meteor/templating';
import { Files } from '/imports/share/collections/files.js';
import invoke from 'lodash.invoke';

Template.Subcards_OtherFiles_Read.viewmodel({
  label: 'Other files',
  fileIds: [],
  files() {
    const fileIds = this.fileIds() && this.fileIds().array() || [];
    return Files.find({ _id: { $in: fileIds } }).fetch();
  },
});
