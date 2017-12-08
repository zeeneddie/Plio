import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/share/collections/lessons.js';

Template.Subcards_LessonsLearned_Read.viewmodel({
  documentId: '',
  lessons() {
    const documentId = this.documentId();
    const query = { documentId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options);
  },
});
