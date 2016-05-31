import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';


Template.StandardsTypeItem.viewmodel({
  hasStandards() {
    return this.standardsBookSections().fetch().length > 0;
  },
  standardsBookSections() {
    return ViewModel.findOne('StandardsList').standardsBookSections(this._id());
  }
});
