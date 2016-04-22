import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standardsBookSections/standardsBookSections.js';

Template.StandardsList.viewmodel({
  stadardsBookSections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  }
});
