import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';


Template.StandardsTypeItem.viewmodel({
  hasStandards() {
    const sections = this.parent().parent().standardsBookSections(this._id()).fetch();
    return sections.length > 0;
  },
  standardsBookSections() {
    return this.parent().parent().standardsBookSections(this._id());
  }
});
