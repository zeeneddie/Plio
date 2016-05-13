import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';


Template.StandardsTypeItem.viewmodel({
  mixin: 'collapse',
  standardsBookSections() {
    return this.parent().standardsBookSections();
  }
});
