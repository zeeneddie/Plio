import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';


Template.StandardsTypeItem.viewmodel({
  standardsBookSections() {
    return this.parent().standardsBookSections(this._id());
  },
  hasStandards() {
    const sections = this.parent().standardsBookSections(this._id()).fetch();
    return sections.length > 0;
  }
});
