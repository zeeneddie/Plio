import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.EditStandard.viewmodel({
  titleValue: '',
  description: '',
  bookSection: null,
  bookSectionValue() {
    return this.bookSection() && this.bookSection()._id ? `${this.bookSection().number}. ${this.bookSection().name}` : '';
  },
  bookSections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  },
  selectedType: '',
  types() {
    return [{ _id: '', name: '' }].concat(StandardsTypes.find({}).fetch()); // add empty option
  }
});
