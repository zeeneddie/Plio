import { Template } from 'meteor/templating';

import { LessonsLearned } from '../../../../../../share/collections';
import { Abbreviations } from '../../../../../../share/constants';

Template.Subcards_LessonsLearned_Read.viewmodel({
  documentId: '',
  lessons() {
    const documentId = this.documentId();
    const query = { documentId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options).fetch();
  },
  renderLessons() {
    return this.lessons()
      .map(({ serialNumber, title }) => `${Abbreviations.LESSON}${serialNumber} ${title}`)
      .join(', ');
  },
});
